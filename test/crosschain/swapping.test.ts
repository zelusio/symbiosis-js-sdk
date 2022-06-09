import { ethers } from 'ethers'
import { Symbiosis, Token, TokenAmount } from '../../src'
import config from './config'

const symbiosis = new Symbiosis(config, 'symbiosis-app')
const swapping = symbiosis.newSwapping()
const wallet = ethers.Wallet.createRandom()

// jest.mock("./demo/wrap-request");

describe('Swapping.exactIn', () => {
    const tokenAmountIn = new TokenAmount(
        new Token({
            chainId: 4,
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
            symbol: 'USDC',
            decimals: 6,
        }),
        (15 * 1e6).toString()
    )

    const tokenOut = new Token({
        chainId: 97,
        address: '',
        symbol: 'BNB',
        decimals: 18,
        isNative: true,
    })

    const slippage = 300 // 3%
    const deadline = Date.now()

    const exactIn = swapping.exactIn(
        tokenAmountIn,
        tokenOut,
        wallet.address,
        wallet.address,
        wallet.address,
        slippage,
        deadline
    )
    it('Route is not empty', async () => {
        const data = await exactIn
        expect(data.route.length).toBeGreaterThan(0)
        // return expect(call).resolves.not.toThrowError();
    })
})
