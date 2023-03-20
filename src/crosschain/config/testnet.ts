import { Config } from '../types'

export const config: Config = {
    minSwapAmountInUsd: 10,
    maxSwapAmountInUsd: 10000,
    advisor: {
        url: 'https://api.testnet.symbiosis.finance/calculations',
    },
    omniPool: {
        chainId: 97,
        address: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
        oracle: '0xcE29b84160fe8B6Fc1c6E5aD66F1F43279F2F1C9',
    },
    chains: [
        {
            id: 5,
            rpc: 'https://rpc.ankr.com/eth_goerli',
            filterBlockOffset: 3000,
            waitForBlocksCount: 5,
            stables: [
                {
                    name: 'USD Coin',
                    address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
                    symbol: 'USDC',
                    isStable: true,
                    decimals: 6,
                    chainId: 5,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            nerves: [],
            router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            dexFee: 30,
            metaRouter: '0x5302358dCFbF2881e5b5E537316786d8Ea242008',
            metaRouterGateway: '0x438D14b1Fd3C20C33Fa7EF6331AA3fC36bc0347E',
            bridge: '0x9f81fAcae42a7312f49A3E27098fC4d39e2c550d',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x7d8B7b5f663E93D7F8970d0A61081Af03c63bB86',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xd655C2c9D558Bf8E3382f98eDADb84e866665139',
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
        {
            id: 97,
            rpc: 'https://rpc.ankr.com/bsc_testnet_chapel',
            filterBlockOffset: 3000,
            waitForBlocksCount: 20,
            stables: [
                {
                    name: 'Binance USD',
                    address: '0x9a01bf917477dd9f5d715d188618fc8b7350cd22',
                    symbol: 'BUSD',
                    isStable: true,
                    decimals: 18,
                    chainId: 97,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
                    },
                },
                {
                    name: 'Synthetic USDC',
                    symbol: 'sUSDC',
                    address: '0x32Ac07C5D3D6002B853836a48EE8538C9CF29ad4',
                    chainId: 97,
                    chainFromId: 5,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Synthetic USDT',
                    symbol: 'sUSDT',
                    address: '0x9505A4F9108aE474c8fAeC17a22e68566c6C12C8',
                    chainId: 97,
                    chainFromId: 43113,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
                {
                    name: 'Synthetic USDC',
                    symbol: 'sUSDC',
                    address: '0xA4bd5C28114341c53e347b17b67d551AFd455516',
                    chainId: 97,
                    chainFromId: 80001,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
                {
                    name: 'Synthetic USDT',
                    symbol: 'sUSDT',
                    address: '0x8341Bc741cd653dC0BEb39D2C57562419B0A2C6E',
                    chainId: 97,
                    chainFromId: 8081,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            nerves: [],
            router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
            dexFee: 30,
            metaRouter: '0xd3F98c243374D79Bfd9a8ac03964623221D53F0f',
            metaRouterGateway: '0x4Ee7B1e8Ad6E1682318f1c47F83634dAa1197eEf',
            bridge: '0xB299eee0Ed46b7a34C01F2a01fc83a0B45aA88AF',
            synthesis: '0x08f5c28ff0622FeF758c2C3c2a5EAEeb63D60D4c',
            portal: '0x0000000000000000000000000000000000000000',
            fabric: '0x9B8D0e0765cDa999910ff31A2204080E1192EfC7',
            multicallRouter: '0x086D8d30822086941729DF294f0e52E42EdC17F9',
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
        {
            id: 43113,
            rpc: 'https://rpc.ankr.com/avalanche_fuji',
            filterBlockOffset: 3000,
            waitForBlocksCount: 20,
            stables: [
                {
                    name: 'USDT',
                    symbol: 'USDT',
                    address: '0x9a01bf917477dd9f5d715d188618fc8b7350cd22',
                    chainId: 43113,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            nerves: [],
            router: '0x4F86a87985a2eD1E843c0b93755Ac06A3DbCc55E',
            dexFee: 30,
            metaRouter: '0x8eC5387A2CdFA5315c05Fd7296C11406AeC2559e',
            metaRouterGateway: '0x80cD2d214ccBdcB214DEA5bC040c8c2002Dc9380',
            bridge: '0xcC0DB081360Eb259bdf6911976c51cAF1B72e845',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x78Bb4D4872121f162BB3e938F0d10cf34E999648',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x8C9D3CE1D59d73259018dBC9859F6eBe62Bbf862',
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
        {
            id: 80001,
            rpc: 'https://rpc.ankr.com/polygon_mumbai',
            filterBlockOffset: 3000,
            waitForBlocksCount: 60,
            stables: [
                {
                    name: 'USDT',
                    symbol: 'USDT',
                    address: '0x9a01bf917477dd9f5d715d188618fc8b7350cd22',
                    chainId: 80001,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            nerves: [],
            router: '0xca33f6D096BDD7FcB28d708f631cD76E73Ecfc2d',
            dexFee: 30,
            metaRouter: '0x2636F6A85aB7bD438631a03e6E7cC6d6ae712642',
            metaRouterGateway: '0x85aDa6757f383577A8AB2a3492ac3E721CcFEAbb',
            bridge: '0x2578412aECCcc32f270A03cfBa25f6557aF4017b',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0x9ad7e9A0D18cC56303277dC5bF77D1910570509a',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0xEc36ED7f5Be3006CF04F85d4851DbDB85b60C19E',
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
        {
            id: 8081,
            rpc: 'https://liberty20.shardeum.org',
            filterBlockOffset: 3000,
            waitForBlocksCount: 1,
            stables: [
                {
                    name: 'USDT',
                    symbol: 'USDT',
                    address: '0xAED47A51AeFa6f95A388aDA3c459d94FF46fC4BB',
                    chainId: 8081,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    },
                },
            ],
            nerves: [],
            router: '0xdeF8D4dc7fB633a0d944EABf8932BF729D61f011',
            dexFee: 30,
            metaRouter: '0xE52e3c838CC91C60a701E78B5043ba9eeEeb55db',
            metaRouterGateway: '0x13fF611B06bEb2A29a49cc3c825cD0eE74967bE3',
            bridge: '0x9D15297f42fEf485f2d061a012cfE699Cc49132B',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: '0xBC4454Ee01EC5B6517333bD716f5135042ca1e38',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x7dc13B605508F91Fcd3bf7803C2b96B43941B4E8',
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
        {
            id: 2494104990,
            rpc: 'https://api.shasta.trongrid.io',
            filterBlockOffset: 3000,
            waitForBlocksCount: 30,
            stables: [
                {
                    name: 'USDT Tron',
                    symbol: 'USDT Tron',
                    address: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
                    chainId: 2494104990,
                    decimals: 6,
                    isStable: true,
                    icons: {
                        large: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                        small: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    },
                },
            ],
            nerves: [],
            router: '0x0000000000000000000000000000000000000000',
            dexFee: 25,
            metaRouter: 'TELoAyns5eHWuiL61tU5BC7YJEsqqebubz',
            metaRouterGateway: '0x0000000000000000000000000000000000000000', // @@
            bridge: 'TQFBn3nLJXCBHmk4zckBm2z6WLyABnT5gA',
            synthesis: '0x0000000000000000000000000000000000000000',
            portal: 'TXmSomqKHEHF2pmgtGvRz7oeLiMvaC9xoc',
            fabric: '0x0000000000000000000000000000000000000000',
            multicallRouter: '0x0000000000000000000000000000000000000000', // @@
            aavePool: '0x0000000000000000000000000000000000000000',
            creamComptroller: '0x0000000000000000000000000000000000000000',
            renGatewayRegistry: '0x0000000000000000000000000000000000000000',
        },
    ],
}
