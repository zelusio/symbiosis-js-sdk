import { ChainId, Symbiosis, Token, TokenAmount } from '../../src'
import config from './config'
import { AddressZero } from '@ethersproject/constants/lib/addresses'

const symbiosis = new Symbiosis(config, 'symbiosis-app')
describe('new', () => {
    it('clientId', () => {
        expect(symbiosis.clientId).toEqual('0x73796d62696f7369732d61707000000000000000000000000000000000000000')
    })
    it('providers', () => {
        expect(symbiosis.providers.size).toEqual(3)
    })
    it('config', () => {
        expect(symbiosis.config).toEqual(config)
    })
})

describe('validateSwapAmounts', () => {
    const token = new Token({
        chainId: 1,
        address: AddressZero,
        symbol: 'USDC',
        decimals: 6,
    })
    it('less than threshold: $8', () => {
        const tokenAmount = new TokenAmount(token, '8000000')
        expect(() => symbiosis.validateSwapAmounts(tokenAmount)).toThrowError()
    })
    it('greater than threshold: $11000', () => {
        const tokenAmount = new TokenAmount(token, '11000000000')
        expect(() => symbiosis.validateSwapAmounts(tokenAmount)).toThrowError()
    })
    it('ok: $50', () => {
        const tokenAmount = new TokenAmount(token, '50000000')
        expect(() => symbiosis.validateSwapAmounts(tokenAmount)).not.toThrowError()
    })
})

describe('findTransitStable', () => {
    it('', () => {
        const transitStable = symbiosis.findTransitStable(ChainId.AVAX_TESTNET)
        expect(transitStable?.address).toEqual('0x9a01bf917477dD9F5D715D188618fc8B7350cd22')
    })
})
