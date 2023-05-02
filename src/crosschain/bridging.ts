import { MaxUint256 } from '@ethersproject/constants'
import { Log, TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'
import { Token, TokenAmount } from '../entities'
import type { Symbiosis } from './symbiosis'
import {
    getTransactionInfoById,
    isTronToken,
    prepareTronTransaction,
    tronAddressToEvm,
    TronTransactionData,
} from './tron'
import { TRON_PORTAL_ABI } from './tronAbis'
import { BridgeDirection } from './types'
import { getExternalId, getInternalId, prepareTransactionRequest } from './utils'
import { WaitForComplete } from './waitForComplete'
import { Portal__factory, Synthesis__factory } from './contracts'
import { TransactionInfo } from 'tronweb'

export type RequestNetworkType = 'evm' | 'tron'

export type WaitForMined = Promise<{
    receipt: TransactionReceipt
    waitForComplete: () => Promise<Log>
}>

export type Execute = Promise<{
    response: TransactionResponse
    waitForMined: () => WaitForMined
}>

export type BridgeExactIn = Promise<
    {
        fee: TokenAmount
        tokenAmountOut: TokenAmount
    } & (
        | {
              type: 'evm'
              execute: (signer: Signer) => Execute
              transactionRequest: TransactionRequest
          }
        | {
              type: 'tron'
              transactionRequest: TronTransactionData
          }
    )
>

export interface BridgeExactInParams {
    tokenAmountIn: TokenAmount
    tokenOut: Token
    from: string
    to: string
    revertableAddress: string
}

export class Bridging {
    public tokenAmountIn: TokenAmount | undefined
    public tokenOut: Token | undefined
    public tokenAmountOut: TokenAmount | undefined
    public direction!: BridgeDirection
    public from!: string
    public to!: string
    public revertableAddress!: string

    protected fee: TokenAmount | undefined

    private readonly symbiosis: Symbiosis

    public constructor(symbiosis: Symbiosis) {
        this.symbiosis = symbiosis
    }

    public async exactIn({ from, revertableAddress, to, tokenAmountIn, tokenOut }: BridgeExactInParams): BridgeExactIn {
        if (this.tokenAmountIn?.token !== tokenAmountIn.token || this.tokenOut !== tokenOut) {
            this.fee = undefined
        }

        this.symbiosis.validateSwapAmounts(tokenAmountIn)

        this.tokenAmountIn = tokenAmountIn
        this.tokenOut = tokenOut
        this.from = from
        this.to = to
        this.revertableAddress = revertableAddress
        this.direction = tokenAmountIn.token.isSynthetic ? 'burn' : 'mint'

        const fee = this.fee || (await this.getFee())

        this.fee = fee

        const tokenAmountOut = new TokenAmount(this.tokenOut, this.tokenAmountIn.raw)
        if (tokenAmountOut.lessThan(this.fee)) {
            throw new Error('Amount out less than fee')
        }

        this.tokenAmountOut = tokenAmountOut.subtract(this.fee)

        if (isTronToken(this.tokenAmountIn.token)) {
            const transactionRequest = this.getTronTransactionRequest(fee)

            return {
                fee,
                tokenAmountOut: this.tokenAmountOut,
                transactionRequest,
                type: 'tron',
            }
        }

        const transactionRequest = this.getEvmTransactionRequest(fee)

        return {
            execute: (signer: Signer) => this.execute(transactionRequest, signer),
            fee,
            tokenAmountOut: this.tokenAmountOut,
            transactionRequest,
            type: 'evm',
        }
    }

    protected async getFee(): Promise<TokenAmount> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        if (this.direction === 'mint') {
            return await this.getMintFee()
        }

        return await this.getBurnFee()
    }

    protected async execute(transactionRequest: TransactionRequest, signer: Signer): Execute {
        const preparedTransactionRequest = await prepareTransactionRequest(transactionRequest, signer)

        const response = await signer.sendTransaction(preparedTransactionRequest)

        return {
            response,
            waitForMined: (confirmations = 1) => this.waitForMined(confirmations, response),
        }
    }

    protected async waitForMined(confirmations: number, response: TransactionResponse): WaitForMined {
        const receipt = await response.wait(confirmations)

        return {
            receipt,
            waitForComplete: () => this.waitForComplete(receipt),
        }
    }

    protected getTronTransactionRequest(fee: TokenAmount): TronTransactionData {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const { chainId } = this.tokenAmountIn.token

        const portalAddress = this.symbiosis.chainConfig(chainId).portal

        // TODO: Other methods
        return prepareTronTransaction({
            abi: TRON_PORTAL_ABI,
            ownerAddress: this.from,
            contractAddress: portalAddress,
            functionName: 'synthesize',
            params: [
                fee.raw.toString(),
                this.tokenAmountIn.token.address,
                this.tokenAmountIn.raw.toString(),
                this.to,
                this.symbiosis.synthesis(this.tokenOut.chainId).address,
                this.symbiosis.bridge(this.tokenOut.chainId).address,
                this.revertableAddress,
                this.tokenOut.chainId.toString(),
                this.symbiosis.clientId,
            ],
            tronWeb: this.symbiosis.tronWeb(chainId),
        })
    }

    protected getEvmTransactionRequest(fee: TokenAmount): TransactionRequest {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const { chainId } = this.tokenAmountIn.token

        // burn
        if (this.direction === 'burn') {
            const synthesis = this.symbiosis.synthesis(chainId)

            const portalAddress = tronAddressToEvm(this.symbiosis.chainConfig(this.tokenOut.chainId).portal)
            const bridgeAddress = tronAddressToEvm(this.symbiosis.chainConfig(this.tokenOut.chainId).bridge)

            return {
                chainId,
                to: synthesis.address,
                data: synthesis.interface.encodeFunctionData('burnSyntheticToken', [
                    fee.raw.toString(),
                    this.tokenAmountIn.token.address,
                    this.tokenAmountIn.raw.toString(),
                    tronAddressToEvm(this.to),
                    portalAddress,
                    bridgeAddress,
                    tronAddressToEvm(this.revertableAddress),
                    this.tokenOut.chainId,
                    this.symbiosis.clientId,
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
                    this.symbiosis.clientId,
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
                this.symbiosis.clientId,
            ]),
        }
    }

    private async getMintFee(): Promise<TokenAmount> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        const chainIdIn = this.tokenAmountIn.token.chainId
        const chainIdOut = this.tokenOut.chainId

        const portalAddress = tronAddressToEvm(this.symbiosis.chainConfig(chainIdIn).portal)
        const synthesisAddress = tronAddressToEvm(this.symbiosis.chainConfig(chainIdOut).synthesis)

        const synthesisInterface = Synthesis__factory.createInterface()

        const internalId = getInternalId({
            contractAddress: portalAddress,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: synthesisAddress,
            revertableAddress: tronAddressToEvm(this.revertableAddress),
            chainId: chainIdOut,
        })

        const calldata = synthesisInterface.encodeFunctionData('mintSyntheticToken', [
            '1', // _stableBridgingFee,
            externalId, // externalID,
            tronAddressToEvm(this.tokenAmountIn.token.address), // _token,
            chainIdIn, // block.chainid,
            this.tokenAmountIn.raw.toString(), // _amount,
            this.to, // _chain2address
        ])

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide: synthesisAddress,
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

        const synthesis = this.symbiosis.synthesis(chainIdIn)
        const portalAddress = tronAddressToEvm(this.symbiosis.chainConfig(chainIdOut).portal)

        const internalId = getInternalId({
            contractAddress: synthesis.address,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: portalAddress,
            revertableAddress: tronAddressToEvm(this.revertableAddress),
            chainId: chainIdOut,
        })

        const portalInterface = Portal__factory.createInterface()
        const calldata = portalInterface.encodeFunctionData('unsynthesize', [
            '1', // _stableBridgingFee,
            externalId, // externalID,
            tronAddressToEvm(this.tokenOut.address), // rtoken,
            this.tokenAmountIn.raw.toString(), // _amount,
            tronAddressToEvm(this.to), // _chain2address
        ])

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide: portalAddress,
            calldata,
            chainIdFrom: chainIdIn,
            chainIdTo: chainIdOut,
        })

        return new TokenAmount(this.tokenOut, fee.toString())
    }

    // TODO: move to utils
    async tronWaitForMined(txId: string): Promise<TransactionInfo> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        let info: TransactionInfo | undefined

        const tronWeb = this.symbiosis.tronWeb(this.tokenAmountIn?.token.chainId)

        const TRIES = 5
        for (let i = 0; i < TRIES; i++) {
            const response = await getTransactionInfoById(tronWeb, txId)
            console.log('response', response)
            if (response) {
                info = response
                break
            }

            await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        if (!info) {
            throw new Error('Transaction not found')
        }

        return info
    }

    async waitForComplete(receipt: TransactionReceipt): Promise<Log> {
        if (!this.tokenAmountIn || !this.tokenOut) {
            throw new Error('Tokens are not set')
        }

        return new WaitForComplete({
            direction: this.direction,
            chainIdOut: this.tokenOut.chainId,
            symbiosis: this.symbiosis,
            revertableAddress: tronAddressToEvm(this.revertableAddress),
            chainIdIn: this.tokenAmountIn.token.chainId,
        }).waitForComplete(receipt)
    }
}
