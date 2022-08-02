/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export declare namespace MetaRouteStructsNonEvm {
    export type MetaMintTransactionNonEvmStruct = {
        stableBridgingFee: BigNumberish
        amount: BigNumberish
        externalID: BytesLike
        tokenReal: BytesLike
        chainID: BigNumberish
        to: string
        swapTokens: string[]
        secondDexRouter: string
        secondSwapCalldata: BytesLike
        finalReceiveSide: string
        finalCalldata: BytesLike
        finalOffset: BigNumberish
    }

    export type MetaMintTransactionNonEvmStructOutput = [
        BigNumber,
        BigNumber,
        string,
        string,
        BigNumber,
        string,
        string[],
        string,
        string,
        string,
        string,
        BigNumber
    ] & {
        stableBridgingFee: BigNumber
        amount: BigNumber
        externalID: string
        tokenReal: string
        chainID: BigNumber
        to: string
        swapTokens: string[]
        secondDexRouter: string
        secondSwapCalldata: string
        finalReceiveSide: string
        finalCalldata: string
        finalOffset: BigNumber
    }

    export type MetaRouteTransactionNonEvmStruct = {
        firstSwapCalldata: BytesLike
        secondSwapCalldata: BytesLike
        approvedTokens: string[]
        firstDexRouter: string
        secondDexRouter: string
        amount: BigNumberish
        nativeIn: boolean
        relayRecipient: string
        otherSideCalldata: BytesLike
    }

    export type MetaRouteTransactionNonEvmStructOutput = [
        string,
        string,
        string[],
        string,
        string,
        BigNumber,
        boolean,
        string,
        string
    ] & {
        firstSwapCalldata: string
        secondSwapCalldata: string
        approvedTokens: string[]
        firstDexRouter: string
        secondDexRouter: string
        amount: BigNumber
        nativeIn: boolean
        relayRecipient: string
        otherSideCalldata: string
    }
}

export interface MetaRouterNonEvmInterface extends utils.Interface {
    contractName: 'MetaRouterNonEvm'
    functions: {
        'externalCall(address,uint256,address,bytes,uint256)': FunctionFragment
        'metaMintSwap((uint256,uint256,bytes32,bytes,uint256,address,address[],address,bytes,address,bytes,uint256))': FunctionFragment
        'metaRoute((bytes,bytes,address[],address,address,uint256,bool,address,bytes))': FunctionFragment
        'metaRouterGateway()': FunctionFragment
    }

    encodeFunctionData(
        functionFragment: 'externalCall',
        values: [string, BigNumberish, string, BytesLike, BigNumberish]
    ): string
    encodeFunctionData(
        functionFragment: 'metaMintSwap',
        values: [MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct]
    ): string
    encodeFunctionData(
        functionFragment: 'metaRoute',
        values: [MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct]
    ): string
    encodeFunctionData(functionFragment: 'metaRouterGateway', values?: undefined): string

    decodeFunctionResult(functionFragment: 'externalCall', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'metaMintSwap', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'metaRoute', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'metaRouterGateway', data: BytesLike): Result

    events: {}
}

export interface MetaRouterNonEvm extends BaseContract {
    contractName: 'MetaRouterNonEvm'
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    interface: MetaRouterNonEvmInterface

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>

    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
    listeners(eventName?: string): Array<Listener>
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
    removeAllListeners(eventName?: string): this
    off: OnEvent<this>
    on: OnEvent<this>
    once: OnEvent<this>
    removeListener: OnEvent<this>

    functions: {
        externalCall(
            _token: string,
            _amount: BigNumberish,
            _receiveSide: string,
            _calldata: BytesLike,
            _offset: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        metaMintSwap(
            _metaMintTransaction: MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        metaRoute(
            _metarouteTransaction: MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        metaRouterGateway(overrides?: CallOverrides): Promise<[string]>
    }

    externalCall(
        _token: string,
        _amount: BigNumberish,
        _receiveSide: string,
        _calldata: BytesLike,
        _offset: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    metaMintSwap(
        _metaMintTransaction: MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    metaRoute(
        _metarouteTransaction: MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct,
        overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    metaRouterGateway(overrides?: CallOverrides): Promise<string>

    callStatic: {
        externalCall(
            _token: string,
            _amount: BigNumberish,
            _receiveSide: string,
            _calldata: BytesLike,
            _offset: BigNumberish,
            overrides?: CallOverrides
        ): Promise<void>

        metaMintSwap(
            _metaMintTransaction: MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct,
            overrides?: CallOverrides
        ): Promise<void>

        metaRoute(
            _metarouteTransaction: MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct,
            overrides?: CallOverrides
        ): Promise<void>

        metaRouterGateway(overrides?: CallOverrides): Promise<string>
    }

    filters: {}

    estimateGas: {
        externalCall(
            _token: string,
            _amount: BigNumberish,
            _receiveSide: string,
            _calldata: BytesLike,
            _offset: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        metaMintSwap(
            _metaMintTransaction: MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        metaRoute(
            _metarouteTransaction: MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        metaRouterGateway(overrides?: CallOverrides): Promise<BigNumber>
    }

    populateTransaction: {
        externalCall(
            _token: string,
            _amount: BigNumberish,
            _receiveSide: string,
            _calldata: BytesLike,
            _offset: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        metaMintSwap(
            _metaMintTransaction: MetaRouteStructsNonEvm.MetaMintTransactionNonEvmStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        metaRoute(
            _metarouteTransaction: MetaRouteStructsNonEvm.MetaRouteTransactionNonEvmStruct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        metaRouterGateway(overrides?: CallOverrides): Promise<PopulatedTransaction>
    }
}
