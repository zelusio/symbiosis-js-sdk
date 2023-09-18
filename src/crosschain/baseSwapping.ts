import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { Log, TransactionReceipt, TransactionRequest } from '@ethersproject/providers'
import { BigNumber, utils } from 'ethers'
import JSBI from 'jsbi'
import { ChainId } from '../constants'
import { Percent, Token, TokenAmount, wrappedToken } from '../entities'
import { BIPS_BASE } from './constants'
import { AdaRouter, AvaxRouter, KavaRouter, Synthesis, UniLikeRouter } from './contracts'
import { DataProvider } from './dataProvider'
import type { Symbiosis } from './symbiosis'
import { AggregatorTrade, OneInchTrade, SymbiosisTradeType, UniLikeTrade, IzumiTrade, WrapTrade } from './trade'
import { Transit } from './transit'
import { getExternalId, getInternalId } from './utils'
import { WaitForComplete } from './waitForComplete'
import { Error, ErrorCode } from './error'
import { SymbiosisTrade } from './trade/symbiosisTrade'
import { OneInchProtocols } from './trade/oneInchTrade'
import { OmniPoolConfig } from './types'

export type SwapExactInParams = {
    tokenAmountIn: TokenAmount
    tokenOut: Token
    from: string
    to: string
    revertableAddress: string
    slippage: number
    deadline: number
    oneInchProtocols?: OneInchProtocols
}

export type SwapExactIn = Promise<{
    fee: TokenAmount
    tokenAmountOut: TokenAmount
    tokenAmountOutMin: TokenAmount
    route: Token[]
    priceImpact: Percent
    amountInUsd: TokenAmount
    transactionRequest: TransactionRequest
    approveTo: string
    inTradeType?: SymbiosisTradeType
    outTradeType?: SymbiosisTradeType
}>

export interface DetailedSlippage {
    A: number
    B: number
    C: number
}

export abstract class BaseSwapping {
    public amountInUsd: TokenAmount | undefined

    protected from!: string
    protected to!: string
    protected revertableAddress!: string
    protected tokenAmountIn!: TokenAmount
    protected tokenOut!: Token
    protected slippage!: DetailedSlippage
    protected deadline!: number
    protected ttl!: number

    protected route!: Token[]

    protected tradeA: SymbiosisTrade | undefined
    protected transit!: Transit
    protected tradeC: SymbiosisTrade | undefined

    protected dataProvider: DataProvider

    protected readonly symbiosis: Symbiosis
    protected synthesisV2!: Synthesis

    protected transitTokenIn!: Token
    protected transitTokenOut!: Token

    protected omniPoolConfig: OmniPoolConfig
    protected oneInchProtocols?: OneInchProtocols

    protected feeV2: TokenAmount | undefined

    public constructor(symbiosis: Symbiosis, omniPoolConfig: OmniPoolConfig) {
        this.omniPoolConfig = omniPoolConfig
        this.symbiosis = symbiosis
        this.dataProvider = new DataProvider(symbiosis)
    }

    async doExactIn({
        tokenAmountIn,
        tokenOut,
        from,
        to,
        revertableAddress,
        slippage,
        deadline,
        oneInchProtocols,
    }: SwapExactInParams): SwapExactIn {
        this.oneInchProtocols = oneInchProtocols
        this.tokenAmountIn = tokenAmountIn
        this.tokenOut = tokenOut

        this.transitTokenIn = this.symbiosis.transitToken(this.tokenAmountIn.token.chainId, this.omniPoolConfig)
        this.transitTokenOut = this.symbiosis.transitToken(this.tokenOut.chainId, this.omniPoolConfig)

        this.from = from
        this.to = to
        this.revertableAddress = revertableAddress
        this.slippage = this.buildDetailedSlippage(slippage)
        this.deadline = deadline
        this.ttl = deadline - Math.floor(Date.now() / 1000)
        this.synthesisV2 = this.symbiosis.synthesis(this.omniPoolConfig.chainId)

        if (!this.transitTokenIn.equals(tokenAmountIn.token)) {
            this.tradeA = this.buildTradeA()
            await this.tradeA.init()
        }

        this.transit = this.buildTransit()
        await this.transit.init()

        this.amountInUsd = this.transit.getBridgeAmountIn()

        if (!this.transitTokenOut.equals(tokenOut)) {
            this.tradeC = this.buildTradeC()
            await this.tradeC.init()
        }

        this.route = this.getRoute()

        const fee = await this.getFee(this.transit.feeToken)
        const feeV2 = this.transit.isV2() ? await this.getFeeV2() : undefined

        this.feeV2 = feeV2

        // >>> NOTE create trades with calculated fee
        this.transit = this.buildTransit(fee)
        await this.transit.init()

        if (!this.transitTokenOut.equals(tokenOut)) {
            this.tradeC = this.buildTradeC(feeV2)
            await this.tradeC.init()
        }
        // <<< NOTE create trades with calculated fee

        const transactionRequest = this.getTransactionRequest(fee, feeV2)

        let crossChainFee = fee
        if (feeV2) {
            const pow = BigNumber.from(10).pow(fee.token.decimals)
            const powV2 = BigNumber.from(10).pow(feeV2.token.decimals)

            const feeBase = BigNumber.from(fee.raw.toString()).mul(powV2)
            const feeV2Base = BigNumber.from(feeV2.raw.toString()).mul(pow)

            crossChainFee = new TokenAmount(feeV2.token, feeBase.add(feeV2Base).div(pow).toString())
        }

        const tokenAmountOut = this.tokenAmountOut(feeV2)
        const tokenAmountOutMin = new TokenAmount(
            tokenAmountOut.token,
            JSBI.divide(JSBI.multiply(this.transit.amountOutMin.raw, tokenAmountOut.raw), this.transit.amountOut.raw)
        )

        return {
            fee: crossChainFee,
            tokenAmountOut,
            tokenAmountOutMin,
            route: this.route,
            priceImpact: this.calculatePriceImpact(),
            amountInUsd: this.amountInUsd,
            transactionRequest,
            approveTo: this.approveTo(),
            inTradeType: this.tradeA?.tradeType,
            outTradeType: this.tradeC?.tradeType,
        }
    }

    protected buildDetailedSlippage(totalSlippage: number): DetailedSlippage {
        const MINIMUM_SLIPPAGE = 20 // 0.2%
        if (totalSlippage < MINIMUM_SLIPPAGE) {
            throw new Error('Slippage cannot be less than 0.2%')
        }

        let swapsCount = 1
        let extraSwapsCount = 0
        if (!this.transitTokenIn.equals(this.tokenAmountIn.token)) {
            extraSwapsCount += 1
        }

        if (!this.transitTokenOut.equals(this.tokenOut)) {
            extraSwapsCount += 1
        }
        swapsCount += extraSwapsCount

        const slippage = Math.floor(totalSlippage / swapsCount)

        let aMul = 1
        let cMul = 1

        if (extraSwapsCount == 2) {
            aMul = 0.8
            cMul = 1.2
        }

        const MAX_STABLE_SLIPPAGE = 50 // 0.5%
        if (slippage > MAX_STABLE_SLIPPAGE) {
            const diff = slippage - MAX_STABLE_SLIPPAGE
            const addition = diff / extraSwapsCount

            return { A: (slippage + addition) * aMul, B: MAX_STABLE_SLIPPAGE, C: (slippage + addition) * cMul }
        }

        return { A: slippage * aMul, B: slippage, C: slippage * cMul }
    }

    protected approveTo(): string {
        return this.symbiosis.chainConfig(this.tokenAmountIn.token.chainId).metaRouterGateway
    }

    public async waitForComplete(receipt: TransactionReceipt): Promise<Log> {
        if (!this.tokenOut) {
            throw new Error('Tokens are not set')
        }
        if (this.transit.isV2()) {
            const wfc1 = new WaitForComplete({
                direction: 'mint',
                symbiosis: this.symbiosis,
                revertableAddress: this.revertableAddress,
                chainIdIn: this.tokenAmountIn.token.chainId,
                chainIdOut: this.omniPoolConfig.chainId,
            })
            const log = await wfc1.waitForComplete(receipt)

            const provider = this.symbiosis.getProvider(this.omniPoolConfig.chainId)
            const receipt2 = await provider.getTransactionReceipt(log.transactionHash)

            const wfc2 = new WaitForComplete({
                direction: 'burn',
                symbiosis: this.symbiosis,
                revertableAddress: this.revertableAddress,
                chainIdIn: this.omniPoolConfig.chainId,
                chainIdOut: this.tokenOut.chainId,
            })
            return wfc2.waitForComplete(receipt2)
        }
        return new WaitForComplete({
            direction: this.transit.direction,
            chainIdOut: this.tokenOut.chainId,
            symbiosis: this.symbiosis,
            revertableAddress: this.revertableAddress,
            chainIdIn: this.tokenAmountIn.token.chainId,
        }).waitForComplete(receipt)
    }

    public async findTransitTokenSent(transactionHash: string): Promise<TokenAmount | undefined> {
        const chainId = this.tokenOut.chainId
        const metarouter = this.symbiosis.metaRouter(chainId)
        const providerTo = this.symbiosis.getProvider(chainId)
        const receipt = await providerTo.getTransactionReceipt(transactionHash)
        if (!receipt) {
            return undefined
        }
        const eventId = utils.id('TransitTokenSent(address,uint256,address)')
        const log = receipt.logs.find((i: Log) => {
            return i.topics[0] === eventId
        })
        if (!log) {
            return undefined
        }

        const parsedLog = metarouter.interface.parseLog(log)

        const token = this.symbiosis.tokens().find((i: Token) => {
            return i.chainId === chainId && i.address.toLowerCase() === parsedLog.args.token.toLowerCase()
        })

        if (!token) {
            return undefined
        }

        return new TokenAmount(token, parsedLog.args.amount.toString())
    }

    protected getTransactionRequest(fee: TokenAmount, feeV2: TokenAmount | undefined): TransactionRequest {
        const chainId = this.tokenAmountIn.token.chainId
        const metaRouter = this.symbiosis.metaRouter(chainId)

        const [relayRecipient, otherSideCalldata] = this.otherSideData(fee, feeV2)

        const amount = this.tradeA ? this.tradeA.tokenAmountIn : this.tokenAmountIn
        const value =
            this.tradeA && this.tokenAmountIn.token.isNative
                ? BigNumber.from(this.tradeA.tokenAmountIn.raw.toString())
                : undefined

        const data = metaRouter.interface.encodeFunctionData('metaRoute', [
            {
                amount: amount.raw.toString(),
                nativeIn: amount.token.isNative,
                approvedTokens: this.approvedTokens(),
                firstDexRouter: this.firstDexRouter(),
                firstSwapCalldata: this.firstSwapCalldata(),
                secondDexRouter: this.secondDexRouter(),
                secondSwapCalldata: this.transit.direction === 'burn' ? this.secondSwapCalldata() : [],
                relayRecipient,
                otherSideCalldata,
            },
        ])

        return {
            chainId,
            to: metaRouter.address,
            data,
            value,
        }
    }

    protected calculatePriceImpact(): Percent {
        const zero = new Percent(JSBI.BigInt(0), BIPS_BASE) // 0%
        const pia = this.tradeA?.priceImpact || zero
        const pib = this.transit.priceImpact || zero
        const pic = this.tradeC?.priceImpact || zero

        // console.log([pia, pib, pic].map((i) => i.toSignificant()))

        let pi = pia.add(pib).add(pic)

        const max = new Percent(JSBI.BigInt(10000), BIPS_BASE) // 100%
        if (pi.greaterThan(max)) pi = max

        return new Percent(pi.numerator, pi.denominator)
    }

    protected tokenAmountOut(feeV2?: TokenAmount | undefined): TokenAmount {
        if (this.tradeC) {
            return this.tradeC.amountOut
        }
        if (this.transit.isV2()) {
            let amount = this.transit.amountOut.raw
            if (feeV2) {
                if (JSBI.lessThan(amount, feeV2.raw)) {
                    throw new Error(
                        `Amount ${this.transit.amountOut.toSignificant()} ${
                            feeV2.token.symbol
                        } less than fee ${feeV2.toSignificant()} ${feeV2.token.symbol}`,
                        ErrorCode.AMOUNT_LESS_THAN_FEE
                    )
                }
                amount = JSBI.subtract(amount, feeV2.raw)
            }
            return new TokenAmount(this.tokenOut, amount)
        }

        return this.transit.amountOut
    }

    protected buildTradeA(): SymbiosisTrade {
        const tokenOut = this.transitTokenIn

        if (WrapTrade.isSupported(this.tokenAmountIn, tokenOut)) {
            return new WrapTrade(this.tokenAmountIn, tokenOut, this.to)
        }

        const chainId = this.tokenAmountIn.token.chainId
        const from = this.symbiosis.metaRouter(chainId).address
        const to = from

        if (AggregatorTrade.isAvailable(chainId)) {
            return new AggregatorTrade({
                tokenAmountIn: this.tokenAmountIn,
                tokenOut,
                from,
                to,
                slippage: this.slippage['A'],
                symbiosis: this.symbiosis,
                dataProvider: this.dataProvider,
                clientId: this.symbiosis.clientId,
                oneInchProtocols: this.oneInchProtocols,
            })
        }

        if (IzumiTrade.isSupported(chainId)) {
            return new IzumiTrade({
                symbiosis: this.symbiosis,
                tokenAmountIn: this.tokenAmountIn,
                tokenOut,
                slippage: this.slippage['A'],
                ttl: this.ttl,
                to,
            })
        }

        let routerA: UniLikeRouter | AvaxRouter | AdaRouter | KavaRouter = this.symbiosis.uniLikeRouter(chainId)

        if (chainId === ChainId.AVAX_MAINNET) {
            routerA = this.symbiosis.avaxRouter(chainId)
        }
        if ([ChainId.MILKOMEDA_DEVNET, ChainId.MILKOMEDA_MAINNET].includes(chainId)) {
            routerA = this.symbiosis.adaRouter(chainId)
        }
        if ([ChainId.KAVA_MAINNET].includes(chainId)) {
            routerA = this.symbiosis.kavaRouter(chainId)
        }

        const dexFee = this.symbiosis.dexFee(chainId)
        return new UniLikeTrade(this.tokenAmountIn, tokenOut, to, this.slippage['A'], this.ttl, routerA, dexFee)
    }

    protected buildTransit(fee?: TokenAmount): Transit {
        const amountIn = this.tradeA ? this.tradeA.amountOut : this.tokenAmountIn
        const amountInMin = this.tradeA ? this.tradeA.amountOutMin : amountIn

        return new Transit(
            this.symbiosis,
            amountIn,
            amountInMin,
            this.tokenOut,
            this.transitTokenIn,
            this.transitTokenOut,
            this.slippage['B'],
            this.deadline,
            this.omniPoolConfig,
            fee
        )
    }

    protected tradeCTo() {
        return this.to
    }

    protected buildTradeC(feeV2?: TokenAmount) {
        let amountIn = this.transit.amountOut

        if (this.transit.isV2()) {
            let amountRaw = amountIn.raw
            if (feeV2) {
                if (amountIn.lessThan(feeV2)) {
                    throw new Error(
                        `Amount ${amountIn.toSignificant()} ${
                            amountIn.token.symbol
                        } less than fee ${feeV2.toSignificant()} ${feeV2.token.symbol}`,
                        ErrorCode.AMOUNT_LESS_THAN_FEE
                    )
                }
                amountRaw = JSBI.subtract(amountRaw, feeV2.raw)
            }
            amountIn = new TokenAmount(this.transitTokenOut, amountRaw)
        }

        const chainId = this.tokenOut.chainId
        const dexFee = this.symbiosis.dexFee(chainId)

        if (WrapTrade.isSupported(amountIn, this.tokenOut)) {
            return new WrapTrade(amountIn, this.tokenOut, this.to)
        }

        if (IzumiTrade.isSupported(chainId)) {
            return new IzumiTrade({
                symbiosis: this.symbiosis,
                tokenAmountIn: amountIn,
                tokenOut: this.tokenOut,
                slippage: this.slippage['C'],
                ttl: this.ttl,
                to: this.to,
            })
        }

        // POLYGON_ZK only
        if (chainId === ChainId.POLYGON_ZK && AggregatorTrade.isAvailable(chainId)) {
            const from = this.symbiosis.metaRouter(chainId).address
            return new AggregatorTrade({
                tokenAmountIn: amountIn,
                tokenOut: this.tokenOut,
                from,
                to: this.tradeCTo(),
                slippage: this.slippage['C'],
                symbiosis: this.symbiosis,
                dataProvider: this.dataProvider,
                clientId: this.symbiosis.clientId,
                oneInchProtocols: this.oneInchProtocols,
            })
        }

        if (OneInchTrade.isAvailable(chainId)) {
            const from = this.symbiosis.metaRouter(chainId).address
            const oracle = this.symbiosis.oneInchOracle(chainId)
            return new OneInchTrade(
                amountIn,
                this.tokenOut,
                from,
                this.tradeCTo(),
                this.slippage['C'],
                oracle,
                this.dataProvider,
                this.oneInchProtocols
            )
        }

        let routerC: UniLikeRouter | AvaxRouter | AdaRouter | KavaRouter = this.symbiosis.uniLikeRouter(chainId)

        if (chainId === ChainId.AVAX_MAINNET) {
            routerC = this.symbiosis.avaxRouter(chainId)
        }
        if ([ChainId.MILKOMEDA_DEVNET, ChainId.MILKOMEDA_MAINNET].includes(chainId)) {
            routerC = this.symbiosis.adaRouter(chainId)
        }
        if ([ChainId.KAVA_MAINNET].includes(chainId)) {
            routerC = this.symbiosis.kavaRouter(chainId)
        }

        return new UniLikeTrade(amountIn, this.tokenOut, this.tradeCTo(), this.slippage['C'], this.ttl, routerC, dexFee)
    }

    protected getRoute(): Token[] {
        const started = this.tradeA ? [] : [this.tokenAmountIn.token]
        const terminated = this.tradeC ? [] : [this.tokenOut]

        return [
            ...started,
            ...(this.tradeA ? this.tradeA.route : []),
            ...this.transit.route,
            ...(this.tradeC ? this.tradeC.route : []),
            ...terminated,
        ].reduce((acc: Token[], token: Token) => {
            const found = acc.find((i) => i.equals(token))
            if (found) return acc
            return [...acc, token]
        }, [])
    }

    protected metaBurnSyntheticToken(fee: TokenAmount): [string, string] {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const synthesis = this.symbiosis.synthesis(this.tokenAmountIn.token.chainId)

        const amount = this.transit.getBridgeAmountIn()

        return [
            synthesis.address,
            synthesis.interface.encodeFunctionData('metaBurnSyntheticToken', [
                {
                    stableBridgingFee: fee.raw.toString(),
                    amount: amount.raw.toString(),
                    syntCaller: this.from,
                    finalReceiveSide: this.finalReceiveSide(),
                    sToken: amount.token.address,
                    finalCallData: this.finalCalldata(),
                    finalOffset: this.finalOffset(),
                    chain2address: this.to,
                    receiveSide: this.symbiosis.portal(this.tokenOut.chainId).address,
                    oppositeBridge: this.symbiosis.bridge(this.tokenOut.chainId).address,
                    revertableAddress: this.revertableAddress,
                    chainID: this.tokenOut.chainId,
                    clientID: this.symbiosis.clientId,
                },
            ]),
        ]
    }

    protected metaSynthesize(fee: TokenAmount, feeV2: TokenAmount | undefined): [string, string] {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.transit.isV2() ? this.omniPoolConfig.chainId : this.tokenOut.chainId
        const tokenAmount = this.transit.getBridgeAmountIn()

        const portal = this.symbiosis.portal(chainIdIn)

        return [
            portal.address,
            portal.interface.encodeFunctionData('metaSynthesize', [
                {
                    stableBridgingFee: fee.raw.toString(),
                    amount: tokenAmount.raw.toString(),
                    rtoken: tokenAmount.token.address,
                    chain2address: this.to,
                    receiveSide: this.symbiosis.synthesis(chainIdOut).address,
                    oppositeBridge: this.symbiosis.bridge(chainIdOut).address,
                    syntCaller: this.from,
                    chainID: chainIdOut,
                    swapTokens: this.swapTokens(),
                    secondDexRouter: this.secondDexRouter(),
                    secondSwapCalldata: this.secondSwapCalldata(),
                    finalReceiveSide: this.transit.isV2() ? this.finalReceiveSideV2() : this.finalReceiveSide(),
                    finalCalldata: this.transit.isV2() ? this.finalCalldataV2(feeV2) : this.finalCalldata(),
                    finalOffset: this.transit.isV2() ? this.finalOffsetV2() : this.finalOffset(),
                    revertableAddress: this.revertableAddress,
                    clientID: this.symbiosis.clientId,
                },
            ]),
        ]
    }

    protected otherSideData(fee: TokenAmount, feeV2: TokenAmount | undefined): [string, string] {
        return this.transit.direction === 'burn' ? this.metaBurnSyntheticToken(fee) : this.metaSynthesize(fee, feeV2) // mint or v2
    }

    protected feeMintCallData(): [string, string] {
        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.transit.isV2() ? this.omniPoolConfig.chainId : this.tokenOut.chainId

        const portal = this.symbiosis.portal(chainIdIn)
        const synthesis = this.symbiosis.synthesis(chainIdOut)

        const internalId = getInternalId({
            contractAddress: portal.address,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: synthesis.address,
            revertableAddress: this.revertableAddress,
            chainId: chainIdOut,
        })

        const amount = this.transit.getBridgeAmountIn()

        const callData = synthesis.interface.encodeFunctionData('metaMintSyntheticToken', [
            {
                stableBridgingFee: '0',
                amount: amount.raw.toString(),
                externalID: externalId,
                tokenReal: amount.token.address,
                chainID: chainIdIn,
                to: this.to,
                swapTokens: this.swapTokens(),
                secondDexRouter: this.secondDexRouter(),
                secondSwapCalldata: this.secondSwapCalldata(),
                finalReceiveSide: this.transit.isV2() ? this.finalReceiveSideV2() : this.finalReceiveSide(),
                finalCalldata: this.transit.isV2() ? this.finalCalldataV2() : this.finalCalldata(),
                finalOffset: this.transit.isV2() ? this.finalOffsetV2() : this.finalOffset(),
            },
        ])

        return [synthesis.address, callData]
    }

    protected feeBurnCallData(): [string, string] {
        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.tokenOut.chainId

        const synthesis = this.symbiosis.synthesis(chainIdIn)
        const portal = this.symbiosis.portal(chainIdOut)

        const internalId = getInternalId({
            contractAddress: synthesis.address,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: portal.address,
            revertableAddress: this.revertableAddress,
            chainId: chainIdOut,
        })

        const amount = this.transit.amountOut

        const calldata = portal.interface.encodeFunctionData('metaUnsynthesize', [
            '1', // _stableBridgingFee
            externalId, // _externalID,
            this.to, // _to
            amount.raw.toString(), // _amount
            amount.token.address, // _rToken
            this.finalReceiveSide(), // _finalReceiveSide
            this.finalCalldata(), // _finalCalldata
            this.finalOffset(), // _finalOffset
        ])
        return [portal.address, calldata]
    }

    protected feeBurnCallDataV2(): [string, string] {
        const chainIdIn = this.omniPoolConfig.chainId
        const chainIdOut = this.tokenOut.chainId

        const synthesis = this.symbiosis.synthesis(chainIdIn)
        const portal = this.symbiosis.portal(chainIdOut)

        const internalId = getInternalId({
            contractAddress: synthesis.address,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: portal.address,
            revertableAddress: this.revertableAddress,
            chainId: chainIdOut,
        })

        const calldata = portal.interface.encodeFunctionData('metaUnsynthesize', [
            '0', // _stableBridgingFee
            externalId, // _externalID,
            this.to, // _to
            this.transit.amountOut.raw.toString(), // _amount
            this.transitTokenOut.address, // _rToken
            this.finalReceiveSide(), // _finalReceiveSide
            this.finalCalldata(), // _finalCalldata
            this.finalOffset(), // _finalOffset
        ])
        return [portal.address, calldata]
    }

    protected async getFee(feeToken: Token): Promise<TokenAmount> {
        const chainIdFrom = this.tokenAmountIn.token.chainId
        const chainIdTo = this.transit.isV2() ? this.omniPoolConfig.chainId : this.tokenOut.chainId
        const [receiveSide, calldata] =
            this.transit.direction === 'burn' ? this.feeBurnCallData() : this.feeMintCallData() // mint or v2
        const fee = await this.symbiosis.getBridgeFee({
            receiveSide,
            calldata,
            chainIdFrom,
            chainIdTo,
        })
        return new TokenAmount(feeToken, fee.toString())
    }

    protected async getFeeV2(): Promise<TokenAmount> {
        const feeToken = this.transitTokenOut
        const [receiveSide, calldata] = this.feeBurnCallDataV2()

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide,
            calldata,
            chainIdFrom: this.omniPoolConfig.chainId,
            chainIdTo: this.tokenOut.chainId,
        })
        return new TokenAmount(feeToken, fee.toString())
    }

    protected approvedTokens(): string[] {
        let firstToken = this.tradeA ? this.tradeA.tokenAmountIn.token.address : this.tokenAmountIn.token.address
        if (!firstToken) {
            firstToken = AddressZero // AddressZero if first token is GasToken
        }

        let tokens: string[]
        if (this.transit.direction === 'burn') {
            tokens = [firstToken, ...this.transit.route.map((i) => i.address)]
        } else {
            tokens = [firstToken, this.tradeA ? this.tradeA.amountOut.token.address : this.tokenAmountIn.token.address]
        }
        return tokens
    }

    protected firstDexRouter(): string {
        return this.tradeA?.routerAddress || AddressZero
    }

    protected firstSwapCalldata(): string | [] {
        return this.tradeA?.callData || []
    }

    protected secondDexRouter(): string {
        return this.transit.receiveSide
    }

    protected secondSwapCalldata(): string | [] {
        return this.transit.callData
    }

    protected finalReceiveSide(): string {
        return this.tradeC?.routerAddress || AddressZero
    }

    protected finalReceiveSideV2(): string {
        return this.synthesisV2.address
    }

    protected finalCalldata(): string | [] {
        return this.tradeC?.callData || []
    }

    protected finalCalldataV2(feeV2?: TokenAmount | undefined): string {
        return this.synthesisV2.interface.encodeFunctionData('metaBurnSyntheticToken', [
            {
                stableBridgingFee: feeV2 ? feeV2?.raw.toString() : '0', // uint256 stableBridgingFee;
                amount: this.transit.amountOut.raw.toString(), // uint256 amount;
                syntCaller: this.symbiosis.metaRouter(this.omniPoolConfig.chainId).address, // address syntCaller;
                finalReceiveSide: this.finalReceiveSide(), // address finalReceiveSide;
                sToken: this.transit.amountOut.token.address, // address sToken;
                finalCallData: this.finalCalldata(), // bytes finalCallData;
                finalOffset: this.finalOffset(), // uint256 finalOffset;
                chain2address: this.to, // address chain2address;
                receiveSide: this.symbiosis.portal(this.tokenOut.chainId).address,
                oppositeBridge: this.symbiosis.bridge(this.tokenOut.chainId).address,
                revertableAddress: this.revertableAddress,
                chainID: this.tokenOut.chainId,
                clientID: this.symbiosis.clientId,
            },
        ])
    }

    protected finalOffset(): number {
        return this.tradeC?.callDataOffset || 0
    }

    protected finalOffsetV2(): number {
        return 100
    }

    protected swapTokens(): string[] {
        if (this.transit.route.length === 0) {
            return []
        }

        const tokens = [this.transit.route[0].address, this.transit.route[this.transit.route.length - 1].address]

        if (this.transit.isV2()) {
            return tokens
        }

        if (this.tradeC) {
            tokens.push(wrappedToken(this.tradeC.amountOut.token).address)
        } else {
            tokens.push(...this.extraSwapTokens())
        }
        return tokens
    }

    protected extraSwapTokens(): string[] {
        return []
    }
}
