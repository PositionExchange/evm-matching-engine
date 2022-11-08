/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implement/MatchingEngineCore.sol";
import "./implement/AutoMarketMakerCore.sol";
import "./interfaces/IMatchingEngineAMM.sol";
import "./libraries/extensions/Fee.sol";

import "hardhat/console.sol";

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
    modifier onlyCounterParty() {
        require(
            counterParty == _msgSender() ||
                positionConcentratedLiquidity == _msgSender(),
            "VL_ONLY_COUNTERPARTY"
        );
        _;
    }

    function initialize(
        IERC20 quoteAsset,
        IERC20 baseAsset,
        uint256 basisPoint,
        uint256 baseBasisPoint,
        uint128 maxFindingWordsIndex,
        uint128 initialPip,
        uint128 pipRange,
        uint32 tickSpace,
        address owner,
        address positionLiquidity
    ) external {
        require(!isInitialized, "Initialized");
        isInitialized = true;

        positionConcentratedLiquidity = positionLiquidity;

        _initializeAMM(pipRange, tickSpace, initialPip, 6000);
        _initializeCore(
            basisPoint,
            baseBasisPoint,
            maxFindingWordsIndex,
            initialPip
        );
        _initFee(quoteAsset, baseAsset);
    }

    function addLiquidity(AddLiquidity calldata params)
        public
        override(AutoMarketMakerCore, IAutoMarketMakerCore)
        onlyCounterParty
        returns (
            uint128,
            uint128,
            uint256,
            uint256,
            uint256
        )
    {
        return super.addLiquidity(params);
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        public
        override(AutoMarketMakerCore, IAutoMarketMakerCore)
        returns (uint128, uint128)
    {
        return super.removeLiquidity(params);
    }

    function approve() public {
        console.log("quoteAsset: ", address(quoteAsset));
        console.log("baseAsset: ", address(baseAsset));
        quoteAsset.approve(counterParty, type(uint256).max);
        baseAsset.approve(counterParty, type(uint256).max);

        quoteAsset.approve(positionConcentratedLiquidity, type(uint256).max);
        baseAsset.approve(positionConcentratedLiquidity, type(uint256).max);
    }

    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal override {}

    function _onCrossPipHook(
        uint128 pipNext,
        bool isBuy,
        bool isBase,
        uint128 amount,
        uint32 basisPoint,
        uint128 currentPip,
        SwapState.AmmState memory ammState
    )
        internal
        override(MatchingEngineCore)
        returns (CrossPipResult.Result memory crossPipResult)
    {
        if (pipNext == currentPip) {
            return crossPipResult;
        }

        int256 indexPip = int256(
            LiquidityMath.calculateIndexPipRange(currentPip, pipRange)
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
        crossPipResult = pipNext != 0
            ? _onCrossPipAMMTargetPrice(
                OnCrossPipParams(
                    pipNext,
                    isBuy,
                    isBase,
                    amount,
                    basisPoint,
                    currentPip
                ),
                ammState
            )
            : _onCrossPipAMMNoTargetPrice(
                OnCrossPipParams(
                    pipNext,
                    isBuy,
                    isBase,
                    amount,
                    basisPoint,
                    currentPip
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
        (, uint128 feeProtocolAmm, uint128 totalFilledAmm) = _updateAMMState(
            ammState,
            currentPip,
            isBuy,
            feePercent
        );

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

        uint128 feeProtocol = feeProtocolAmm + (amount * feePercent) / 10000;

        if ((isBuy && isBase) || (isBuy && !isBase)) {
            increaseBaseFeeFunding(feeProtocol);
        } else if ((!isBuy && !isBase) || (!isBuy && isBase)) {
            increaseQuoteFeeFunding(feeProtocol);
        }

        return feeProtocol;
    }

    function increaseQuoteFeeFunding(uint256 quoteFee)
        public
        override(Fee, IFee)
    {
        super.increaseQuoteFeeFunding(quoteFee);
    }

    function increaseBaseFeeFunding(uint256 baseFee)
        public
        override(Fee, IFee)
    {
        super.increaseBaseFeeFunding(baseFee);
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

    function _addReserveSnapshot() internal override(MatchingEngineCore) {}

    function emitEventSwap(
        bool isBuy,
        uint256 _baseAmount,
        uint256 _quoteAmount,
        address _trader
    ) internal override(MatchingEngineCore) {}

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
