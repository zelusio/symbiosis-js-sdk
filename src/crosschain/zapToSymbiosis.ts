import { Signer } from 'ethers'
import { ChainId } from '../constants'
import { TokenAmount } from '../entities'
import { ZapExactIn, Zapping } from './zapping'
import { NervePool } from './contracts'
import { SupplySymbiosis } from './supplySymbiosis'

export class ZapToSymbiosis extends Zapping {
    protected poolAddress!: string

    public async exactIn(
        tokenAmountIn: TokenAmount,
        poolAddress: string,
        poolChainId: ChainId,
        from: string,
        to: string,
        revertableAddress: string,
        slippage: number,
        deadline: number,
        use1Inch = false
    ): ZapExactIn {
        this.use1Inch = use1Inch
        this.tokenAmountIn = tokenAmountIn
        this.poolAddress = poolAddress
        this.chainIdOut = poolChainId
        this.from = from
        this.to = to
        this.revertableAddress = revertableAddress
        this.slippage = slippage
        this.deadline = deadline
        this.ttl = deadline - Math.floor(Date.now() / 1000)

        let amountInUsd: TokenAmount

        if (!this.symbiosis.isTransitStable(tokenAmountIn.token)) {
            this.tradeA = this.buildTradeA()
            await this.tradeA.init()

            amountInUsd = this.tradeA.amountOut
        } else {
            amountInUsd = tokenAmountIn
        }

        this.symbiosis.validateSwapAmounts(amountInUsd)

        this.synthToken = await this.getSynthToken()

        const pool = this.symbiosis.nervePoolByAddress(this.poolAddress, this.chainIdOut)

        this.supply = this.buildNerveLiquidity(pool)
        await this.supply.init()

        const fee = await this.getFee()

        this.supply = this.buildNerveLiquidity(pool, fee)
        await this.supply.init()

        const transactionRequest = this.getTransactionRequest(fee)

        return {
            execute: (signer: Signer) => this.execute(transactionRequest, signer),
            fee,
            tokenAmountOut: this.supply.amountOut,
            priceImpact: this.calculatePriceImpact(),
            amountInUsd: this.getSynthAmount(fee),
            transactionRequest,
        }
    }

    protected buildNerveLiquidity(pool: NervePool, fee?: TokenAmount): SupplySymbiosis {
        const tokenAmountIn = this.getSynthAmount(fee)

        return new SupplySymbiosis(tokenAmountIn, this.to, this.slippage, this.deadline, pool)
    }
}
