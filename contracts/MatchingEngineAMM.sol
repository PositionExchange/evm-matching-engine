/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implement/MatchingEngineCore.sol";
import "./implement/AutoMarketMakerCore.sol";
import "./interfaces/IMatchingEngineAMM.sol";
import "./libraries/extensions/Fee.sol";
import "./libraries/helper/Errors.sol";

contract MatchingEngineAMM is
    IMatchingEngineAMM,
    Fee,
    AutoMarketMakerCore,
    MatchingEngineCore
{
    using Math for uint128;
    bool isInitialized;
    address public counterParty;
    address public positionConcentratedLiquidity;

    function initialize(InitParams memory params) external {
        require(!isInitialized, "Initialized");
        isInitialized = true;

        positionConcentratedLiquidity = params.positionLiquidity;
        counterParty = params.spotHouse;

        _initializeAMM(
            params.pipRange,
            params.tickSpace,
            params.initialPip,
            params.feeShareAmm
        );
        _initializeCore(
            params.basisPoint,
            params.maxFindingWordsIndex,
            params.initialPip
        );
        _initFee(params.quoteAsset, params.baseAsset);

        _approveCounterParty(params.quoteAsset, params.positionLiquidity);
        _approveCounterParty(params.baseAsset, params.positionLiquidity);

        _approveCounterParty(params.quoteAsset, params.spotHouse);
        _approveCounterParty(params.baseAsset, params.spotHouse);
    }

    function _onlyCounterParty()
        internal
        override(MatchingEngineCore, AutoMarketMakerCore)
    {
        require(
            counterParty == _msgSender() ||
                positionConcentratedLiquidity == _msgSender(),
            Errors.VL_ONLY_COUNTERPARTY
        );
    }

    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal override {}

    function _onCrossPipHook(
        CrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        override(MatchingEngineCore)
        returns (CrossPipResult.Result memory crossPipResult)
    {
        if (params.pipNext == params.currentPip) {
            return crossPipResult;
        }

        int256 indexPip = int256(
            LiquidityMath.calculateIndexPipRange(params.currentPip, pipRange)
        );
        if (ammState.lastPipRangeLiquidityIndex != indexPip) {
            if (ammState.lastPipRangeLiquidityIndex != -1) ammState.index++;
            ammState.lastPipRangeLiquidityIndex = indexPip;
        }
        // Modify ammState.ammReserves here will update to `state.ammState.ammReserves` in MatchingEngineCore
        // Eg. given `state.ammState.ammReserves` in MatchingEngineCore is [A, B, C, D, E]
        // if you change ammStates[0] = 1
        // then the `state.ammState.ammReserves` in MatchingEngineCore will be [1, B, C, D, E]
        // because ammStates is passed by an underlying pointer
        // let's try it in Remix
        crossPipResult = params.pipNext != 0
            ? _onCrossPipAMMTargetPrice(
                OnCrossPipParams(
                    params.pipNext,
                    params.isBuy,
                    params.isBase,
                    params.amount,
                    params.basisPoint,
                    params.currentPip
                ),
                ammState
            )
            : _onCrossPipAMMNoTargetPrice(
                OnCrossPipParams(
                    params.pipNext,
                    params.isBuy,
                    params.isBase,
                    params.amount,
                    params.basisPoint,
                    params.currentPip
                ),
                ammState
            );
    }

    function _updateAMMState(
        SwapState.AmmState memory ammState,
        uint128 currentPip,
        bool isBuy,
        uint16 feePercent
    )
        internal
        override(MatchingEngineCore)
        returns (
            uint128 totalFeeAmm,
            uint128 feeProtocolAmm,
            uint128 totalFilledAmm
        )
    {
        currentIndexedPipRange = LiquidityMath.calculateIndexPipRange(
            currentPip,
            pipRange
        );

        (
            totalFeeAmm,
            feeProtocolAmm,
            totalFilledAmm
        ) = _updateAMMStateAfterTrade(ammState, isBuy, feePercent);
    }

    function _calculateFee(
        SwapState.AmmState memory ammState,
        uint128 currentPip,
        bool isBuy,
        bool isBase,
        uint256 mainSideOut,
        uint256 flipSideOut,
        uint16 feePercent
    ) internal override(MatchingEngineCore) returns (uint256) {
        (
            uint128 totalFeeAmm,
            uint128 feeProtocolAmm,
            uint128 totalFilledAmm
        ) = _updateAMMState(ammState, currentPip, isBuy, feePercent);

        uint128 amount;

        if (
            ((isBuy && isBase) || (!isBuy && !isBase)) &&
            uint128(mainSideOut) >= totalFilledAmm
        ) {
            amount = uint128(mainSideOut) - totalFilledAmm;
        } else if (
            ((isBuy && !isBase) || (!isBuy && isBase)) &&
            uint128(flipSideOut) >= totalFilledAmm
        ) {
            amount = uint128(flipSideOut) - totalFilledAmm;
        }

        uint128 feeLimitOrder = (amount * feePercent) /
            FixedPoint128.BASIC_POINT_FEE;
        uint128 feeProtocol = feeProtocolAmm + feeLimitOrder;

        if ((isBuy && isBase) || (isBuy && !isBase)) {
            _increaseBaseFeeFunding(feeProtocol);
        } else if ((!isBuy && !isBase) || (!isBuy && isBase)) {
            _increaseQuoteFeeFunding(feeProtocol);
        }

        return totalFeeAmm + feeLimitOrder;
    }

    function _isNeedSetPipNext()
        internal
        view
        override(MatchingEngineCore)
        returns (bool)
    {
        return true;
    }

    function _approveCounterParty(IERC20 asset, address spender) internal {
        asset.approve(spender, type(uint256).max);
    }

    function increaseQuoteFeeFunding(uint256 quoteFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.increaseQuoteFeeFunding(quoteFee);
    }

    function increaseBaseFeeFunding(uint256 baseFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.increaseBaseFeeFunding(baseFee);
    }

    function decreaseBaseFeeFunding(uint256 quoteFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.decreaseBaseFeeFunding(quoteFee);
    }

    function decreaseQuoteFeeFunding(uint256 baseFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.decreaseQuoteFeeFunding(baseFee);
    }

    function accumulateClaimableAmount(
        uint128 _pip,
        uint64 _orderId,
        ExchangedData memory exData,
        uint256 basisPoint,
        uint16 fee,
        uint128 feeBasis
    ) external view override returns (ExchangedData memory) {
        (
            bool isFilled,
            bool isBuy,
            uint256 baseSize,
            uint256 partialFilled
        ) = getPendingOrderDetail(_pip, _orderId);
        // TODO calculate fee
        uint256 filledSize = isFilled ? baseSize : partialFilled;
        {
            if (isBuy) {
                //BUY => can claim base asset
                exData.baseAmount += filledSize;
                //                );
            } else {
                // SELL => can claim quote asset
                exData.quoteAmount += TradeConvert.baseToQuote(
                    filledSize,
                    _pip,
                    basisPoint
                );
            }
        }
        return exData;
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function _basisPoint()
        internal
        view
        override(AutoMarketMakerCore)
        returns (uint256)
    {
        return basisPoint;
    }

    function getCurrentPip()
        public
        view
        override(MatchingEngineCore, AutoMarketMakerCore, IMatchingEngineCore)
        returns (uint128)
    {
        return singleSlot.pip;
    }

    function emitEventSwap(
        bool isBuy,
        uint256 _baseAmount,
        uint256 _quoteAmount,
        address _trader
    ) internal override(MatchingEngineCore) {
        uint256 amount0In;
        uint256 amount1In;
        uint256 amount0Out;
        uint256 amount1Out;

        if (isBuy) {
            amount1In = _quoteAmount;
            amount0Out = _baseAmount;
        } else {
            amount0In = _baseAmount;
            amount1Out = _quoteAmount;
        }
        emit Swap(
            msg.sender,
            amount0In,
            amount1In,
            amount0Out,
            amount1Out,
            _trader
        );
    }

    function calculatingQuoteAmount(uint256 quantity, uint128 pip)
        external
        view
        override(MatchingEngineCore, IMatchingEngineCore)
        returns (uint256)
    {
        return TradeConvert.baseToQuote(quantity, pip, basisPoint);
    }

    function getLiquidityInPipRange(
        uint128 fromPip,
        uint256 dataLength,
        bool toHigher
    )
        external
        view
        override(MatchingEngineCore, IMatchingEngineCore)
        returns (LiquidityOfEachPip[] memory, uint128)
    {}
}
