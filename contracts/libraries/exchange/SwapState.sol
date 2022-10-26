// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../helper/TradeConvert.sol";

library SwapState {
    enum CurrentLiquiditySide {
        NotSet,
        Buy,
        Sell
    }

    struct AmmReserves {
        uint128 baseReserve;
        uint128 quoteReserve;
        uint128 sqrtK;
    }

    struct AmmState {
        int256 lastPipRangeLiquidityIndex;
        uint8 pipRangeLiquidityIndex;
        uint256[5] pipRangesIndex;
        AmmReserves[5] ammReserves;
    }

    struct State {
        uint256 remainingSize;
        // the tick associated with the current price
        uint128 pip;
        uint32 basisPoint;
        uint32 baseBasisPoint;
        uint128 startPip;
        uint128 remainingLiquidity;
        uint8 isFullBuy;
        bool isSkipFirstPip;
        uint128 lastMatchedPip;
        bool isBuy;
        bool isBase;
        uint256 flipSideOut;
        // For AMM
        AmmState ammState;
    }

    function newAMMState() internal pure returns (AmmState memory) {
        AmmReserves[5] memory _ammReserves;
        uint256[5] memory _pipRangesIndex;
        return
            AmmState({
                lastPipRangeLiquidityIndex: -1,
                pipRangeLiquidityIndex: 0,
                pipRangesIndex: _pipRangesIndex,
                ammReserves: _ammReserves
            });
    }

    function beforeExecute(State memory state) internal pure {
        // Check need to skip first pip
        CurrentLiquiditySide currentLiquiditySide = CurrentLiquiditySide(
            state.isFullBuy
        );
        if (currentLiquiditySide != CurrentLiquiditySide.NotSet) {
            if (state.isBuy)
                // if buy and latest liquidity is buy. skip current pip
                state.isSkipFirstPip =
                    currentLiquiditySide == CurrentLiquiditySide.Buy;
                // if sell and latest liquidity is sell. skip current pip
            else
                state.isSkipFirstPip =
                    currentLiquiditySide == CurrentLiquiditySide.Sell;
        }
    }

    function isReachedMaxPip(
        State memory state,
        uint128 _pipNext,
        uint128 _maxPip
    ) internal pure returns (bool) {
        return
            (state.isBuy && _pipNext > _maxPip) ||
            (!state.isBuy && _pipNext < _maxPip);
    }

    function moveBack1Pip(State memory state) internal pure {
        if (state.isBuy) {
            state.pip--;
        } else {
            state.pip++;
        }
    }

    function moveForward1Pip(State memory state, uint128 pipNext)
        internal
        pure
    {
        if (state.isBuy) {
            state.pip = pipNext + 1;
        } else {
            state.pip = pipNext - 1;
        }
    }

    function updateTradedSize(
        State memory state,
        uint256 tradedQuantity,
        uint128 pipNext
    ) internal pure {
        if (state.remainingSize == tradedQuantity) {
            state.remainingSize = 0;
        } else {
            state.remainingSize -= state.isBase
                ? tradedQuantity
                : TradeConvert.baseToQuote(
                    tradedQuantity,
                    pipNext,
                    state.basisPoint
                );
        }

        state.flipSideOut += state.isBase
            ? TradeConvert.baseToQuote(
                tradedQuantity,
                pipNext,
                state.basisPoint
            )
            : tradedQuantity;
    }

    function reverseIsFullBuy(State memory state) internal {
        if (!state.isBuy) {
            state.isFullBuy = uint8(1);
        } else {
            state.isFullBuy = uint8(2);
        }
    }

    function updatePipRangeIndex(
        State memory state,
        uint256 _pipRangeLiquidityIndex
    ) internal pure {
        // initial lastPipRangeLiquidityIndex = -1
        // so it will update state.pipRangesIndex[0] = _pipRangeLiquidityIndex
        // once _pipRangeLiquidityIndex != the last one (initial one)
        // it will increase the pipRangeLiquidityIndex to 1
        // then update state.pipRangesIndex[1] = the new _pipRangeLiquidityIndex
        // next until 5
        // finally we have an arrays of range liquidity index eg [1301, 1302, 1303, 1304]
        // then now we can use that range to update reserve to the corresponding range
        //        if (state.ammState.lastPipRangeLiquidityIndex != -1) {
        //            state.ammState.pipRangeLiquidityIndex++;
        //        }
        if (
            state.ammState.lastPipRangeLiquidityIndex !=
            int256(_pipRangeLiquidityIndex)
        ) {
            state.ammState.pipRangeLiquidityIndex++;
            if (state.ammState.pipRangeLiquidityIndex > 5) {
                revert("Not enough liquidity");
            }
            state.ammState.lastPipRangeLiquidityIndex = int256(
                _pipRangeLiquidityIndex
            );
            // set pip ranges at pipRangesIndex to _pipRangeLiquidityIndex
            state.ammState.pipRangesIndex[
                state.ammState.pipRangeLiquidityIndex
            ] = _pipRangeLiquidityIndex;
        }
    }

    function updateAMMTradedSize(
        State memory state,
        uint128 baseAmount,
        uint128 quoteAmount
    ) internal pure {
        if (state.isBase) {
            state.flipSideOut += quoteAmount;
            state.remainingSize -= baseAmount;
        } else {
            state.flipSideOut += baseAmount;
            state.remainingSize -= quoteAmount;
        }
    }

    function ammFillAll(
        State memory state,
        uint128 baseAmount,
        uint128 quoteAmount
    ) internal pure {
        state.remainingSize = 0;
        state.flipSideOut += state.isBase ? quoteAmount : baseAmount;
    }
}
