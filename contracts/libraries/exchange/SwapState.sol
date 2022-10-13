// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../helper/TradeConvert.sol";

library SwapState {
    enum CurrentLiquiditySide {
        NotSet,
        Buy,
        Sell
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
        int8 lastPipRangeLiquidityIndex;
        bool isBase;
        uint256 flipSideOut;
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

    function moveForward1Pip(State memory state) internal pure {
        if (state.isBuy) {
            state.pip++;
        } else {
            state.pip--;
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

    function reverseIsFullBuy(State memory state)
        internal
        pure
        returns (uint8)
    {
        if (state.isFullBuy == 1) {
            return 2;
        } else {
            return 1;
        }
    }
}
