import { canOneInch } from '../../../../web-sdk-playground/js-sdk/src'
import { ChainId } from '../../../../web-sdk-playground/js-sdk'

describe('canOneInch', () => {
    it('BSC_MAINNET', () => {
        expect(canOneInch(ChainId.BSC_MAINNET)).toEqual(true)
    })
    it('ETH_MAINNET', () => {
        expect(canOneInch(ChainId.ETH_MAINNET)).toEqual(true)
    })
    it('AVAX_MAINNET', () => {
        expect(canOneInch(ChainId.AVAX_MAINNET)).toEqual(true)
    })
    it('MATIC_MAINNET', () => {
        expect(canOneInch(ChainId.MATIC_MAINNET)).toEqual(true)
    })
    it('BOBA_MAINNET', () => {
        expect(canOneInch(ChainId.BOBA_MAINNET)).toEqual(false)
    })
})
