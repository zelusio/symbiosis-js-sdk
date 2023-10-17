import { ChainId } from '../../constants'
import { Config } from '../types'

export const config: Config = {
    advisor: {
        url: 'https://api-v2.symbiosis.finance/calculations',
    },
    omniPools: [
        {
            chainId: 56288,
            address: '0x6148FD6C649866596C3d8a971fC313E5eCE84882',
            oracle: '0x7775b274f0C3fA919B756b22A4d9674e55927ab8',
        },
        {
            chainId: 56288,
            address: '0xBcc2637DFa64999F75abB53a7265b5B4932e40eB',
            oracle: '0x628613064b1902a1A422825cf11B687C6f17961E',
        },
    ],
    revertableAddress: {
        [ChainId.TRON_MAINNET]: '0xd99ac0681b904991169a4f398B9043781ADbe0C3',
        default: '0xd99ac0681b904991169a4f398B9043781ADbe0C3',
    },
    chains: [
        {
            id: 1,
            rpc: 'https://ethereum.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 12,
            stables: [
                {
                    name: 'USD Coin',
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    symbol: 'USDC',
                    decimals: 6,
                    chainId: 1,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Symbiosis',
                    symbol: 'SIS',
                    address: '0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9',
                    chainId: 1,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/15084.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/15084.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                    chainId: 1,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
                {
                    name: 'Tether USD',
                    symbol: 'USDT',
                    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                    chainId: 1,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            dexFee: 30,
            metaRouter: '0x1DCfbC3fA01b2a86bC3a3f43479cCe9E8D438Adc',
            metaRouterGateway: '0x0A0B7D1eea99e6189995432fec8172bB2dFFF847',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x49d3Fc00f3ACf80FABCb42D7681667B20F60889A',
            aavePool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
            aavePoolDataProvider: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
            creamComptroller: '0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258',
            creamCompoundLens: '0xd400e22dcA840CC7E342DF1d9945684bBd587659',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 56,
            rpc: 'https://bsc.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 20,
            stables: [
                {
                    name: 'BUSD Token',
                    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                    symbol: 'BUSD',
                    decimals: 18,
                    chainId: 56,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
                    },
                },
                {
                    name: 'USD Coin',
                    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
                    symbol: 'USDC',
                    decimals: 18,
                    chainId: 56,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Ethereum Token',
                    symbol: 'ETH',
                    address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
                    chainId: 56,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            dexFee: 25,
            metaRouter: '0x9A31bAC4b3B958C835C243800B474818D04393dd',
            metaRouterGateway: '0x83f71AabdDBb9F0E3B6462Cc7635b6fFAD0f2f2e',
            bridge: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            synthesis: '0x6B1bbd301782FF636601fC594Cd7Bfe74871bfaA',
            portal: '0x5Aa5f7f84eD0E5db0a4a85C3947eA16B53352FD4',
            fabric: '0xc17d768Bf4FdC6f20a4A0d8Be8767840D106D077',
            multicallRouter: '0x44b5d0F16Ad55c4e7113310614745e8771b963bB',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x589de0f0ccf905477646599bb3e5c622c84cc0ba',
            creamCompoundLens: '0x06fd4e17Dd35d0dE9FE17eeAE4e94fBA57fEF154',
            renGatewayRegistry: '0xf36666C230Fa12333579b9Bd6196CB634D6BC506',
            blocksPerYear: 0,
        },
        {
            id: 43114,
            rpc: 'https://avalanche-c-chain.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 30,
            stables: [
                {
                    name: 'USD Coin',
                    address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
                    symbol: 'USDC.e',
                    decimals: 6,
                    chainId: 43114,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'USD Coin',
                    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
                    symbol: 'USDC',
                    decimals: 6,
                    chainId: 43114,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106',
            dexFee: 30,
            metaRouter: '0x7bD0a0549e546f4e1C2D8eC53F705f8f60559bb1',
            metaRouterGateway: '0x3006Dd3B40f33598A0a219602998D8C3715e75E5',
            bridge: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xE75C7E85FE6ADd07077467064aD15847E6ba9877',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xDc9a6a26209A450caC415fb78487e907c660cf6a',
            aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
            aavePoolDataProvider: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
            creamComptroller: '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4',
            creamCompoundLens: '0x5b4058A9000e86fe136Ac896352C4DFD539E32a1',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 137,
            rpc: 'https://polygon-bor.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 60,
            stables: [
                {
                    name: 'USD Coin (PoS)',
                    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    symbol: 'USDC',
                    decimals: 6,
                    chainId: 137,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
                    chainId: 137,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
            dexFee: 30,
            metaRouter: '0xF951789c6A356BfbC3033648AA10b5Dd3e9d88C0',
            metaRouterGateway: '0x5d025432bcbe100354b5fb7b1a68d1641e677f6c',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xc5B61b9abC3C6229065cAD0e961aF585C5E0135c',
            aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
            aavePoolDataProvider: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
            creamComptroller: '0x20CA53E2395FA571798623F1cFBD11Fe2C114c24',
            creamCompoundLens: '0xa7B0C2e904d597b89b4bf91927A3B90459f8bb9E',
            renGatewayRegistry: '0xf36666C230Fa12333579b9Bd6196CB634D6BC506',
            blocksPerYear: 0,
        },
        {
            id: 40,
            rpc: 'https://mainnet.telos.net/evm',
            filterBlockOffset: 3000,
            waitForBlocksCount: 120,
            stables: [
                {
                    name: 'syUSDC',
                    address: '0xe6E5f3d264117E030C21920356641DbD5B3d660c',
                    symbol: 'USDC',
                    decimals: 6,
                    chainId: 40,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0x9b1adec00a25fffd87a5bb17f61916e1c26f6844',
            dexFee: 25,
            metaRouter: '0x7775b274f0c3fa919b756b22a4d9674e55927ab8',
            metaRouterGateway: '0xb52e582263c1d0189b3cc1402c1b7205b7f2e9ba',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x1a039cE63AE35a67Bf0E9F6DbFaE969639D59eC8',
            portal: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            fabric: '0x8a7F930003BedD63A1ebD99C5917FD6aE7E3dedf',
            multicallRouter: '0xcB28fbE3E9C0FEA62E0E63ff3f232CECfE555aD4',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 2222,
            rpc: 'https://evm.kava.io/',
            filterBlockOffset: 2000,
            waitForBlocksCount: 30,
            stables: [
                {
                    name: 'Tether USDt',
                    symbol: 'USDT',
                    address: '0x919C1c267BC06a7039e03fcc2eF738525769109c',
                    chainId: 2222,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            router: '0xA7544C409d772944017BB95B99484B6E0d7B6388',
            dexFee: 30,
            metaRouter: '0x88139ad1199e8c78a0804d4bebf4fbad89ef9d89',
            metaRouterGateway: '0x3a696f9201bafadfded7953933ab2832b38fc023',
            bridge: '0xda8057acB94905eb6025120cB2c38415Fd81BfEB',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 288,
            rpc: 'https://mainnet.boba.network',
            filterBlockOffset: 3000,
            waitForBlocksCount: 0,
            stables: [
                {
                    name: 'USD Coin',
                    address: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
                    symbol: 'USDC',
                    decimals: 6,
                    chainId: 288,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            dexFee: 30,
            metaRouter: '0xbbad2fe9558e55ebfa04b3b5bff0b6c4e2ffdd2c',
            metaRouterGateway: '0xda411e3b9047ae198dfb7448e97ca900fe793035',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x506803495B1876FE1fA6Cd9dC65fB060057A4Cc3',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 56288,
            rpc: 'https://symbiosis.bnb.boba.network',
            filterBlockOffset: 3000,
            waitForBlocksCount: 0,
            stables: [
                {
                    name: 'USD Coin',
                    address: '0x9F98f9F312D23d078061962837042b8918e6aff2',
                    symbol: 'USDC',
                    decimals: 18,
                    chainId: 56288,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            dexFee: 30,
            metaRouter: '0xB79A4F5828eb55c10D7abF4bFe9a9f5d11aA84e0',
            metaRouterGateway: '0x37E44E4400A43F0c27ed42cF6EBEE3493A3e4d2f',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            portal: '0x0000000000000000000000000000000000000000',
            fabric: '0x5Aa5f7f84eD0E5db0a4a85C3947eA16B53352FD4',
            multicallRouter: '0xcB28fbE3E9C0FEA62E0E63ff3f232CECfE555aD4',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 324,
            rpc: 'https://mainnet.era.zksync.io',
            filterBlockOffset: 2000,
            waitForBlocksCount: 12,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
                    chainId: 324,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
                    chainId: 324,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0x8B791913eB07C32779a16750e3868aA8495F5964',
            dexFee: 30,
            metaRouter: '0x4f30036b5858f77F98d8D35c3b21BEb18916Ba9a',
            metaRouterGateway: '0x2F7c5901DeBFb7faD804Db800F226de3dd0cffd5',
            bridge: '0xb0D30aD9C1A7b303977DB7ea073a4329d930D94c',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x39dE19C9fF25693A2311AAD1dc5C790194084A39',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xe004DE550074856bD64Cc1A89A8B3b56bD3eAf31',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 42161,
            rpc: 'https://arb1.arbitrum.io/rpc',
            filterBlockOffset: 2000,
            waitForBlocksCount: 240,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
                    chainId: 42161,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    deprecated: true,
                    name: 'USD Coin (Arb1)',
                    symbol: 'USDC.e',
                    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
                    chainId: 42161,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
                    chainId: 42161,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0xD01319f4b65b79124549dE409D36F25e04B3e551',
            dexFee: 30,
            metaRouter: '0xca506793A420E901BbCa8066be5661E3C52c84c2',
            metaRouterGateway: '0xd92ca299f1c2518e78e48c207b64591ba6e9b9a8',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x01A3c8E513B758EBB011F7AFaf6C37616c9C24d9',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xda8057acB94905eb6025120cB2c38415Fd81BfEB',
            aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
            aavePoolDataProvider: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 10,
            rpc: 'https://optimism.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 50,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
                    chainId: 10,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x4200000000000000000000000000000000000006',
                    chainId: 10,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0x0000000000000000000000000000000000000000',
            dexFee: 0,
            metaRouter: '0x1a039ce63ae35a67bf0e9f6dbfae969639d59ec8',
            metaRouterGateway: '0x1e4bf3cabd7707089138dd5a545b077413fa83fc',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
            aavePoolDataProvider: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 42170,
            rpc: 'https://nova.arbitrum.io/rpc',
            filterBlockOffset: 2000,
            waitForBlocksCount: 60,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0x750ba8b76187092B0D1E87E28daaf484d1b5273b',
                    chainId: 42170,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x722e8bdd2ce80a4422e880164f2079488e115365',
                    chainId: 42170,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
            dexFee: 30,
            metaRouter: '0xf85fc807d05d3ab2309364226970aac57b4e1ea4',
            metaRouterGateway: '0xcd7c056b39ddfb568e451923abedb9b6a7aeb885',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 1101,
            rpc: 'https://rpc.ankr.com/polygon_zkevm',
            filterBlockOffset: 2000,
            waitForBlocksCount: 0,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
                    chainId: 1101,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
                    chainId: 1101,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0x0000000000000000000000000000000000000000',
            dexFee: 30,
            metaRouter: '0xDF41Ce9d15e9b6773ef20cA682AFE56af6Bb3F94',
            metaRouterGateway: '0x3b561BdeDf4Ebaa708633B73D58B57EB7CD970d3',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 59144,
            rpc: 'https://rpc.linea.build',
            filterBlockOffset: 2000,
            waitForBlocksCount: 0,
            stables: [
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
                    chainId: 59144,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
                    chainId: 59144,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0xc66149996d0263C0B42D3bC05e50Db88658106cE',
            dexFee: 30,
            metaRouter: '0x8a7F930003BedD63A1ebD99C5917FD6aE7E3dedf',
            metaRouterGateway: '0xe6e5f3d264117e030c21920356641dbd5b3d660c',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 5000,
            rpc: 'https://rpc.mantle.xyz',
            filterBlockOffset: 2000,
            waitForBlocksCount: 10,
            stables: [
                {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
                    chainId: 5000,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',
                    chainId: 5000,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0xDd0840118bF9CCCc6d67b2944ddDfbdb995955FD',
            dexFee: 30,
            metaRouter: '0xA738e84fdE890Bc60b99AF7ccE43990E534304de',
            metaRouterGateway: '0x5074b7ca7162f793318b65d8becc5975df327c80',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x292fC50e4eB66C3f6514b9E402dBc25961824D62',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: 8453,
            rpc: 'https://base.publicnode.com',
            filterBlockOffset: 2000,
            waitForBlocksCount: 30,
            stables: [
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x4200000000000000000000000000000000000006',
                    chainId: 8453,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
                {
                    name: 'USD Base Coin',
                    symbol: 'USDbC',
                    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
                    chainId: 8453,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            router: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',
            dexFee: 0,
            metaRouter: '0x6F0f6393e45fE0E7215906B6f9cfeFf53EA139cf',
            metaRouterGateway: '0x4cfA66497Fa84D739a0f785FBcEe9196f1C64e4a',
            bridge: '0x8097f0B9f06C27AF9579F75762F971D745bb222F',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xEE981B2459331AD268cc63CE6167b446AF4161f8',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x01A3c8E513B758EBB011F7AFaf6C37616c9C24d9',
            aavePool: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
            aavePoolDataProvider: '0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: ChainId.TRON_MAINNET,
            rpc: 'https://api.trongrid.io',
            filterBlockOffset: 2000,
            waitForBlocksCount: 20,
            stables: [
                {
                    name: 'Tether USDt',
                    symbol: 'USDT',
                    address: '0xa614f803b6fd780986a42c78ec9c7f77e6ded13c',
                    chainId: ChainId.TRON_MAINNET,
                    decimals: 6,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            router: '0x6E0617948FE030A7E4970F8389D4AD295F249B7E',
            dexFee: 30,
            metaRouter: '0x7d2f60748310d51bf24aab58c382b204104d4504',
            metaRouterGateway: '0x09639856487b357d656d329b7a8800812b5d1114',
            bridge: '0x149b1992e1cb0839cdfa7493ebf1a04286eb6e4a',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x4badeb0ca175da3ac6a4c886ca31990688d2a260',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x354ed0e8616678f2829feb2e2e9a0e0869fa82fb',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
        {
            id: ChainId.SCROLL_MAINNET,
            rpc: 'https://rpc.scroll.io',
            filterBlockOffset: 2000,
            waitForBlocksCount: 20,
            stables: [
                {
                    name: 'Wrapped Ether',
                    symbol: 'WETH',
                    address: '0x5300000000000000000000000000000000000004',
                    chainId: ChainId.SCROLL_MAINNET,
                    decimals: 18,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
                    },
                },
            ],
            router: '0x0000000000000000000000000000000000000000',
            dexFee: 0,
            metaRouter: '0xcE8f24A58D85eD5c5A6824f7be1F8d4711A0eb4C',
            metaRouterGateway: '0xAdB2d3b711Bb8d8Ea92ff70292c466140432c278',
            bridge: '0x5523985926Aa12BA58DC5Ad00DDca99678D7227E',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x5Aa5f7f84eD0E5db0a4a85C3947eA16B53352FD4',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x01A3c8E513B758EBB011F7AFaf6C37616c9C24d9',
            aavePool: '0x0000000000000000000000000000000000000000',
            aavePoolDataProvider: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            creamCompoundLens: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
            blocksPerYear: 0,
        },
    ],
}
