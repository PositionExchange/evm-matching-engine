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
import "./libraries/helper/Require.sol";

contract MatchingEngineAMM is
    IMatchingEngineAMM,
    Fee,
    AutoMarketMakerCore,
    MatchingEngineCore
{
    using Math for uint128;
    bool isInitialized;
    address public counterParty;
    address public positionManagerLiquidity;

    /// @notice initialize the contract right after deploy
    /// @notice only call once time
    /// @dev initialize the sub contract, approve contract
    function initialize(InitParams memory params) external {
        Require._require(!isInitialized, Errors.ME_INITIALIZED);
        isInitialized = true;
        positionManagerLiquidity = params.positionLiquidity;
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

    /// @notice implement hook function
    /// @notice require only counter party can call
    function _onlyCounterParty()
        internal
        view
        override(MatchingEngineCore, AutoMarketMakerCore)
    {
        Require._require(
            counterParty == _msgSender() ||
                positionManagerLiquidity == _msgSender(),
            Errors.ME_ONLY_COUNTERPARTY
        );
    }

    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal override {}

    /// @notice implement hook function
    /// @notice call to amm contract
    function _onCrossPipHook(
        CrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        view
        override(MatchingEngineCore)
        returns (CrossPipResult.Result memory crossPipResult)
    {
        if (params.pipNext == params.currentPip) {
            return crossPipResult;
        }

        int256 indexPip = int256(
            LiquidityMath.calculateIndexPipRange(
                params.currentPip,
                params.pipRange
            )
        );
        if (ammState.lastPipRangeLiquidityIndex != indexPip) {
            if (ammState.lastPipRangeLiquidityIndex != -1) ammState.index++;
            ammState.lastPipRangeLiquidityIndex = indexPip;
        }
        /// Modify ammState.ammReserves here will update to `state.ammState.ammReserves` in MatchingEngineCore
        /// Eg. given `state.ammState.ammReserves` in MatchingEngineCore is [A, B, C, D, E]
        /// if you change ammStates[0] = 1
        /// then the `state.ammState.ammReserves` in MatchingEngineCore will be [1, B, C, D, E]
        /// because ammStates is passed by an underlying pointer
        /// let's try it in Remix
        crossPipResult = _onCrossPipAMMTargetPrice(
            OnCrossPipParams(
                params.pipNext,
                params.isBuy,
                params.isBase,
                params.amount,
                params.basisPoint,
                params.currentPip,
                params.pipRange
            ),
            ammState
        );
    }

    /// @notice implement update amm state
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

    /// @notice implement calculate fee
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

    /// @notice implement need set pip next
    function _isNeedSetPipNext()
        internal
        pure
        override(MatchingEngineCore)
        returns (bool)
    {
        return true;
    }

    /// @notice approve counter party
    function _approveCounterParty(IERC20 asset, address spender) internal {
        asset.approve(spender, type(uint256).max);
    }

    /// @inheritdoc IFee
    function increaseQuoteFeeFunding(uint256 quoteFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.increaseQuoteFeeFunding(quoteFee);
    }

    /// @inheritdoc IFee
    function increaseBaseFeeFunding(uint256 baseFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.increaseBaseFeeFunding(baseFee);
    }

    /// @inheritdoc IFee
    function decreaseBaseFeeFunding(uint256 quoteFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.decreaseBaseFeeFunding(quoteFee);
    }

    /// @inheritdoc IFee
    function decreaseQuoteFeeFunding(uint256 baseFee)
        public
        override(Fee, IFee)
    {
        _onlyCounterParty();
        super.decreaseQuoteFeeFunding(baseFee);
    }

    /// @inheritdoc IMatchingEngineAMM
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
        uint256 filledSize = isFilled ? baseSize : partialFilled;
        {
            if (isBuy) {
                //BUY => can claim base asset
                exData.baseAmount += filledSize;
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

    /// @notice get basis point
    function _basisPoint()
        internal
        view
        override(AutoMarketMakerCore)
        returns (uint256)
    {
        return basisPoint;
    }

    /// @notice get current pip
    function getCurrentPip()
        public
        view
        override(MatchingEngineCore, AutoMarketMakerCore, IMatchingEngineCore)
        returns (uint128)
    {
        return singleSlot.pip;
    }

    function _getPipRange()
        internal
        view
        override(MatchingEngineCore)
        returns (uint128)
    {
        return pipRange;
    }

    function _calculatePipLimitWhenFindPipNext(
        uint128 pip,
        bool isBuy,
        uint32 basisPoint
    ) internal pure override(MatchingEngineCore) returns (uint128 limitPip) {
        uint128 rangeWords = 400;
        if (basisPoint == 100) {
            rangeWords = 20;
        } else if (basisPoint == 10_000) {
            rangeWords = 300;
        }

        limitPip = isBuy ? pip + rangeWords * 256 : pip <= rangeWords * 256
            ? 1
            : pip - rangeWords * 256;
    }

    /// @notice implement emit event swap
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

    /// @notice implement calculate quote amount
    function calculatingQuoteAmount(uint256 quantity, uint128 pip)
        external
        view
        override(MatchingEngineCore, IMatchingEngineCore)
        returns (uint256)
    {
        return TradeConvert.baseToQuote(quantity, pip, basisPoint);
    }
}
