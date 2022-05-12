import { TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/providers'
import { Coin, Coins, MsgExecuteContract, SyncTxBroadcastResult, TxInfo } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-types'
import { BigNumber, Signer } from 'ethers'
import { base64 } from 'ethers/lib/utils'
import { TerraChainId } from '../constants'
import { Token, TokenAmount } from '../entities'
import { isTerraChainId } from '../utils'
import { Portal__factory } from './contracts'
import type { Symbiosis } from './symbiosis'
import { BridgeDirection } from './types'
import {
    calculateGasMargin,
    encodeTerraAddress,
    encodeTerraAddressToEvmAddress,
    getExternalId,
    getInternalId,
    getTerraExternalId,
    getTerraInternalId,
} from './utils'
import { WaitForComplete } from './waitForComplete'
import { Error, ErrorCode } from './error'

export type WaitForMined = Promise<{
    blockNumber: number
    waitForComplete: () => Promise<string>
}>

export type Execute = Promise<{
    transactionHash: string
    waitForMined: () => WaitForMined
}>

interface TerraSynthesizeExecuteMessage {
    synthesize: {
        amount: string
        target: string
        chain_id: string
        stablecoin_fee: string
        asset_info:
            | {
                  cw20_token: {
                      address: string
                  }
              }
            | {
                  native_coin: {
                      denom: string
                  }
              }
        opposite_bridge: string
        opposite_synthesis: string
    }
}

interface EvmExactIn {
    chainType: 'evm'
    execute: (signer: Signer) => Execute
    fee: TokenAmount
    tokenAmountOut: TokenAmount
    transactionRequest: TransactionRequest
}

interface TerraExactIn {
    chainType: 'terra'
    execute: (wallet: ConnectedWallet) => Execute
    fee: TokenAmount
    tokenAmountOut: TokenAmount
    executeMessage: TerraSynthesizeExecuteMessage
}

export type ExactIn = Promise<EvmExactIn | TerraExactIn>

export class Bridging {
    public tokenAmountIn: TokenAmount | undefined
    public tokenOut: Token | undefined
    public tokenAmountOut: TokenAmount | undefined
    public direction!: BridgeDirection
    public to!: string
    public revertableAddress!: string

    protected fee: TokenAmount | undefined

    private readonly symbiosis: Symbiosis

    public constructor(symbiosis: Symbiosis) {
        this.symbiosis = symbiosis
    }

    public async exactIn(tokenAmountIn: TokenAmount, tokenOut: Token, to: string, revertableAddress: string): ExactIn {
        if (this.tokenAmountIn?.token !== tokenAmountIn.token || this.tokenOut !== tokenOut) {
            this.fee = undefined
        }

        this.symbiosis.validateSwapAmounts(tokenAmountIn)

        this.tokenAmountIn = tokenAmountIn
        this.tokenOut = tokenOut
        this.to = to
        this.revertableAddress = revertableAddress
        this.direction = tokenAmountIn.token.isSynthetic ? 'burn' : 'mint'

        if (!this.fee) {
            this.fee = await this.getFee()
        }

        const fee = this.fee

        const tokenAmountOut = new TokenAmount(this.tokenOut, this.tokenAmountIn.raw)
        if (tokenAmountOut.lessThan(this.fee)) {
            throw new Error(
                `Amount $${tokenAmountOut.toSignificant()} less than fee $${this.fee.toSignificant()}`,
                ErrorCode.AMOUNT_LESS_THAN_FEE
            )
        }

        this.tokenAmountOut = tokenAmountOut.subtract(this.fee)

        if (tokenAmountIn.token.isFromTerra()) {
            const executeMessage = this.getTerraExecuteMessage(this.fee)

            return {
                chainType: 'terra',
                executeMessage,
                execute: (wallet: ConnectedWallet) => this.executeTerra(executeMessage, wallet),
                fee,
                tokenAmountOut: this.tokenAmountOut,
            }
        }

        const transactionRequest = this.getEvmTransactionRequest(fee)

        return {
            chainType: 'evm',
            execute: (signer: Signer) => this.executeEvm(transactionRequest, signer),
            fee,
            tokenAmountOut: this.tokenAmountOut,
            transactionRequest,
        }
    }

    protected async getFee(): Promise<TokenAmount> {
        if (this.direction === 'mint') {
            return await this.getMintFee()
        }

        return await this.getBurnFee()
    }

    protected async executeEvm(transactionRequest: TransactionRequest, signer: Signer): Execute {
        const transactionRequestWithGasLimit = { ...transactionRequest }

        const gasLimit = await signer.estimateGas(transactionRequestWithGasLimit)

        transactionRequestWithGasLimit.gasLimit = calculateGasMargin(gasLimit)

        const response = await signer.sendTransaction(transactionRequestWithGasLimit)

        return {
            transactionHash: response.hash,
            waitForMined: (confirmations = 1) => this.waitForEvmMined(confirmations, response),
        }
    }

    protected async executeTerra(executeMessage: TerraSynthesizeExecuteMessage, wallet: ConnectedWallet): Execute {
        if (!this.tokenAmountIn) {
            throw new Error('Tokens are not set')
        }

        const { chainId } = this.tokenAmountIn.token

        if (!isTerraChainId(chainId)) {
            throw new Error('Token not from terra')
        }

        let coins: Coins.Input | undefined
        if ('native_coin' in executeMessage.synthesize.asset_info) {
            coins = [
                new Coin(executeMessage.synthesize.asset_info.native_coin.denom, this.tokenAmountIn.raw.toString()),
            ]
        }

        const portalAddress = this.symbiosis.getTerraPortalAddress(chainId)

        const execute = new MsgExecuteContract(wallet.terraAddress, portalAddress, executeMessage, coins)

        const signResult = await wallet.sign({ msgs: [execute] })

        const lcdcClient = this.symbiosis.getTerraLCDClient(chainId)

        const response = await lcdcClient.tx.broadcastSync(signResult.result)

        return {
            transactionHash: response.txhash,
            waitForMined: () => this.waitForTerraMined(response, chainId),
        }
    }

    protected async waitForTerraMined(result: SyncTxBroadcastResult, chainId: TerraChainId): WaitForMined {
        const lcdcClient = this.symbiosis.getTerraLCDClient(chainId)

        const TIMEOUT = 250 // 250ms
        const WAITING_TIME = 60 * 2000 // 2min

        for (let attempts = 0; attempts < WAITING_TIME / TIMEOUT; attempts++) {
            const txInfo = await lcdcClient.tx.txInfo(result.txhash).catch(() => {
                // nothing
            })

            if (txInfo) {
                return {
                    blockNumber: txInfo.height,
                    waitForComplete: () => this.terraWaitForComplete(txInfo),
                }
            }

            await new Promise((resolve) => setTimeout(resolve, TIMEOUT))
        }

        throw new Error('The transaction was not broadcasted')
    }

    protected async waitForEvmMined(confirmations: number, response: TransactionResponse): WaitForMined {
        const receipt = await response.wait(confirmations)

        return {
            blockNumber: receipt.blockNumber,
            waitForComplete: () => this.evmWaitForComplete(receipt),
        }
    }

    protected getTerraExecuteMessage(fee: TokenAmount): TerraSynthesizeExecuteMessage {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const tokenIn = this.tokenAmountIn.token

        if (!tokenIn.symbol) {
            throw new Error('Token symbol is not set')
        }

        if (this.direction === 'burn') {
            throw new Error(`Burning tokens from Terra is not supported yet`)
        }

        return {
            synthesize: {
                stablecoin_fee: fee.raw.toString(),
                amount: this.tokenAmountIn.raw.toString(),
                target: base64.encode(this.to),
                chain_id: this.tokenOut.chainId.toString(),
                asset_info: tokenIn.isNative
                    ? { native_coin: { denom: tokenIn.address } }
                    : { cw20_token: { address: tokenIn.address } },
                opposite_bridge: base64.encode(this.symbiosis.bridge(this.tokenOut.chainId).address),
                opposite_synthesis: base64.encode(this.symbiosis.synthesis(this.tokenOut.chainId).address),
            },
        }
    }

    protected getEvmTransactionRequest(fee: TokenAmount): TransactionRequest {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const { chainId } = this.tokenAmountIn.token

        // burn
        if (this.direction === 'burn') {
            const synthesis = this.symbiosis.synthesis(chainId)

            return {
                chainId,
                to: synthesis.address,
                data: synthesis.interface.encodeFunctionData('burnSyntheticToken', [
                    fee.raw.toString(),
                    this.tokenAmountIn.token.address,
                    this.tokenAmountIn.raw.toString(),
                    this.to,
                    this.symbiosis.portal(this.tokenOut.chainId).address,
                    this.symbiosis.bridge(this.tokenOut.chainId).address,
                    this.revertableAddress,
                    this.tokenOut.chainId,
                ]),
            }
        }

        const portal = this.symbiosis.portal(chainId)

        if (this.tokenAmountIn.token.isNative) {
            return {
                chainId,
                to: portal.address,
                data: portal.interface.encodeFunctionData('synthesizeNative', [
                    fee.raw.toString(),
                    this.to,
                    this.symbiosis.synthesis(this.tokenOut.chainId).address,
                    this.symbiosis.bridge(this.tokenOut.chainId).address,
                    this.revertableAddress,
                    this.tokenOut.chainId,
                ]),
                value: BigNumber.from(this.tokenAmountIn.raw.toString()),
            }
        }

        return {
            chainId,
            to: portal.address,
            data: portal.interface.encodeFunctionData('synthesize', [
                fee.raw.toString(),
                this.tokenAmountIn.token.address,
                this.tokenAmountIn.raw.toString(),
                this.to,
                this.symbiosis.synthesis(this.tokenOut.chainId).address,
                this.symbiosis.bridge(this.tokenOut.chainId).address,
                this.revertableAddress,
                this.tokenOut.chainId,
            ]),
        }
    }

    private async getMintFee(): Promise<TokenAmount> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.tokenOut.chainId

        if (isTerraChainId(chainIdOut)) {
            throw new Error(`Terra doesn't support minting yet`)
        }

        // From terra
        if (isTerraChainId(chainIdIn)) {
            const lcdClient = this.symbiosis.getTerraLCDClient(chainIdIn)

            const portalAddress = this.symbiosis.getTerraPortalAddress(chainIdIn)

            const queryResult = await lcdClient.wasm.contractQuery<{ request_count: string }>(portalAddress, {
                get_request_count: {},
            })

            const requestCount = Number(queryResult.request_count)
            if (Number.isNaN(requestCount)) {
                throw new Error('Invalid request count')
            }

            const synthesis = this.symbiosis.synthesis(chainIdOut)

            const internalId = getTerraInternalId({
                contractAddress: portalAddress,
                requestCount: requestCount + 1,
                chainId: chainIdIn,
            })

            const externalId = getTerraExternalId({
                internalId,
                contractAddress: synthesis.address,
                revertableAddress: this.revertableAddress,
                chainId: chainIdOut,
            })

            const calldata = synthesis.interface.encodeFunctionData('mintSyntheticToken', [
                '1', // _stableBridgingFee,
                externalId, // externalID,
                encodeTerraAddressToEvmAddress(this.tokenAmountIn.token), // _token,
                chainIdIn, // block.chainid,
                this.tokenAmountIn.raw.toString(), // _amount,
                this.to, // _chain2address
            ])

            const fee = await this.symbiosis.getBridgeFee({
                receiveSide: synthesis.address,
                calldata,
                chainIdFrom: this.tokenAmountIn.token.chainId,
                chainIdTo: this.tokenOut.chainId,
            })

            return new TokenAmount(this.tokenOut, fee.toString())
        }

        const portal = this.symbiosis.portal(chainIdIn)
        const portalRequestCountBN = await portal.requestCount()

        const contractAddress = portal.address
        const requestCount = portalRequestCountBN.toNumber()

        const internalId = getInternalId({ contractAddress, requestCount, chainId: chainIdIn })

        const synthesis = this.symbiosis.synthesis(chainIdOut)
        const externalId = getExternalId({
            internalId,
            contractAddress: synthesis.address,
            revertableAddress: this.revertableAddress,
            chainId: chainIdOut,
        })

        const calldata = synthesis.interface.encodeFunctionData('mintSyntheticToken', [
            '1', // _stableBridgingFee,
            externalId, // externalID,
            this.tokenAmountIn.token.address, // _token,
            chainIdIn, // block.chainid,
            this.tokenAmountIn.raw.toString(), // _amount,
            this.to, // _chain2address
        ])

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide: synthesis.address,
            calldata,
            chainIdFrom: this.tokenAmountIn.token.chainId,
            chainIdTo: this.tokenOut.chainId,
        })

        return new TokenAmount(this.tokenOut, fee.toString())
    }

    private async getBurnFee(): Promise<TokenAmount> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.tokenOut.chainId

        if (isTerraChainId(chainIdIn)) {
            throw new Error(`Burning tokens from Terra is not supported yet`)
        }

        const synthesis = this.symbiosis.synthesis(chainIdIn)

        let portalAddress: string
        let revertableAddress: string
        if (isTerraChainId(chainIdOut)) {
            const terraPortalAddress = this.symbiosis.getTerraPortalAddress(chainIdOut)

            portalAddress = encodeTerraAddress(terraPortalAddress)
            revertableAddress = encodeTerraAddress(this.revertableAddress)
        } else {
            portalAddress = this.symbiosis.portal(chainIdOut).address
            revertableAddress = this.revertableAddress
        }

        const synthesisRequestsCount = (await synthesis.requestCount()).toNumber()

        const internalId = getInternalId({
            contractAddress: synthesis.address,
            requestCount: synthesisRequestsCount,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: portalAddress,
            revertableAddress,
            chainId: chainIdOut,
        })

        let receiverTokenAddress: string
        let chainToAddress: string
        if (this.tokenOut.isFromTerra()) {
            receiverTokenAddress = encodeTerraAddressToEvmAddress(this.tokenOut)
            chainToAddress = encodeTerraAddress(this.to)
        } else {
            receiverTokenAddress = this.tokenOut.address
            chainToAddress = this.to
        }

        const calldata = Portal__factory.createInterface().encodeFunctionData('unsynthesize', [
            '1', // _stableBridgingFee,
            externalId, // externalID,
            receiverTokenAddress, // rtoken,
            this.tokenAmountIn.raw.toString(), // _amount,
            chainToAddress, // _chain2address
        ])

        let receiveSide: string
        if (isTerraChainId(chainIdOut)) {
            receiveSide = this.symbiosis.getTerraPortalAddress(chainIdOut)
        } else {
            receiveSide = this.symbiosis.portal(chainIdOut).address
        }

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide,
            calldata,
            chainIdFrom: chainIdIn,
            chainIdTo: chainIdOut,
        })

        return new TokenAmount(this.tokenOut, fee.toString())
    }

    async terraWaitForComplete(txInfo: TxInfo): Promise<string> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        return new WaitForComplete({
            direction: this.direction,
            tokenOut: this.tokenOut,
            symbiosis: this.symbiosis,
            revertableAddress: this.revertableAddress,
            chainIdIn: this.tokenAmountIn.token.chainId,
        }).transactionFromTerra(txInfo)
    }

    async evmWaitForComplete(result: TransactionReceipt): Promise<string> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        return new WaitForComplete({
            direction: this.direction,
            tokenOut: this.tokenOut,
            symbiosis: this.symbiosis,
            revertableAddress: this.revertableAddress,
            chainIdIn: this.tokenAmountIn.token.chainId,
        }).transactionFromEvm(result)
    }
}
