export const TRON_METAROUTER_ABI = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'TransitTokenSent',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_receiveSide',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: '_calldata',
                type: 'bytes',
            },
            {
                internalType: 'uint256',
                name: '_offset',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
        ],
        name: 'externalCall',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'stableBridgingFee',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bytes32',
                        name: 'crossChainID',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes32',
                        name: 'externalID',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenReal',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'chainID',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'address[]',
                        name: 'swapTokens',
                        type: 'address[]',
                    },
                    {
                        internalType: 'address',
                        name: 'secondDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'secondSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'address',
                        name: 'finalReceiveSide',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'finalCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'uint256',
                        name: 'finalOffset',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct MetaRouteStructs.MetaMintTransaction',
                name: '_metaMintTransaction',
                type: 'tuple',
            },
        ],
        name: 'metaMintSwap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'firstSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'bytes',
                        name: 'secondSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'address[]',
                        name: 'approvedTokens',
                        type: 'address[]',
                    },
                    {
                        internalType: 'address',
                        name: 'firstDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'secondDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'nativeIn',
                        type: 'bool',
                    },
                    {
                        internalType: 'address',
                        name: 'relayRecipient',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'otherSideCalldata',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct MetaRouteStructs.MetaRouteTransaction',
                name: '_metarouteTransaction',
                type: 'tuple',
            },
        ],
        name: 'metaRoute',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'metaRouterGateway',
        outputs: [
            {
                internalType: 'contract MetaRouterGateway',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: '_swapCalldata',
                type: 'bytes',
            },
            {
                internalType: 'address',
                name: '_burnToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_synthesis',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: '_burnCalldata',
                type: 'bytes',
            },
        ],
        name: 'returnSwap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const
