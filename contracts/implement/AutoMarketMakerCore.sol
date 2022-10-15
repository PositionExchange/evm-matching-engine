/**
 * @author Musket
 */
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";
import "../libraries/helper/Math.sol";
import "../libraries/helper/LiquidityMath.sol";
import "../interfaces/IAutoMarketMakerCore.sol";
import "../libraries/exchange/SwapState.sol";

abstract contract AutoMarketMakerCore is IAutoMarketMakerCore, AMMCoreStorage {
    using Liquidity for Liquidity.Info;
    using Math for uint128;

    uint128 public constant CURVE_PIP = 1e36;

    function initializeAMM(
        uint128 _pipRange,
        uint128 _liquidity,
        uint32 _tickSpace
    ) internal {
        pipRange = _pipRange;
        tickSpace = _tickSpace;
    }

    function addLiquidity(
        uint128 baseAmount,
        uint128 quoteAmount,
        uint32 indexedPipRange
    )
        external
        virtual
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint32 liquidity
        )
    {
        Liquidity.Info memory _liquidityInfo = liquidityInfo[indexedPipRange];
        uint128 sqrtPipMin;
        uint128 sqrtPipMax;

        uint128 currentPrice = getCurrentPrice();

        if (_liquidityInfo.sqrtK == 0) {
            (sqrtPipMin, sqrtPipMax) = LiquidityMath.calculatePipRange(
                indexedPipRange,
                pipRange
            );
            sqrtPipMin = (sqrtPipMin * CURVE_PIP).sqrt128();
            sqrtPipMax = (sqrtPipMax * CURVE_PIP).sqrt128();

            // TODO init k
            liquidityInfo[indexedPipRange].initNewPipRange(
                sqrtPipMax,
                sqrtPipMin,
                indexedPipRange
            );
            _liquidityInfo = liquidityInfo[indexedPipRange];
        }

        uint128 quoteReal;
        uint128 baseReal;
        if (indexedPipRange < currentIndexedPipRange) {
            currentPrice = sqrtPipMax;
        } else if (indexedPipRange > currentIndexedPipRange) {
            currentPrice = sqrtPipMin;
        }
        quoteReal = LiquidityMath.calculateQuoteReal(
            _liquidityInfo.sqrtMinPip,
            quoteAmount,
            currentPrice
        );
        baseReal = LiquidityMath.calculateBaseReal(
            _liquidityInfo.sqrtMinPip,
            quoteAmount,
            sqrtPipMin
        );

        uint128 sqrtK = (baseReal * quoteReal).sqrt128();

        //        _liquidityInfo.u

        // TODO calculate liquidity
        return (0, 0, 0);
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        external
        virtual
        returns (uint128 baseAmount, uint128 quoteAmount)
    {
        return (0, 0);
    }

    function modifyLiquidity(ModifyLiquidity calldata params)
        external
        virtual
        returns (
            uint128 newLiquidity,
            uint256 newBaseAmount,
            uint256 newQuoteAmount
        )
    {
        return (0, 0, 0);
    }

    function getCurrentPrice() internal view virtual returns (uint128) {}

    struct OnCrossPipParams {
        uint128 pipNext;
        bool isBuy;
        bool isBase;
        uint128 amount;
    }
    struct CrossPipState {
        int256 indexedPipRange;
        uint128 pipTargetStep;
        uint128 sqrtTargetPip;
    }

    function _onCrossPipAMMTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        view
        returns (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint8 pipRangeLiquidityIndex,
            uint128 toPip
        )
    {
        CrossPipState memory crossPipState;
        // Have target price
        crossPipState.sqrtTargetPip = (params.pipNext * CURVE_PIP).sqrt128();
        crossPipState.indexedPipRange = int256(
            LiquidityMath.calculateIndexPipRange(params.pipNext, pipRange)
        );
        for (
            int256 i = ammState.lastPipRangeLiquidityIndex;
            i <= crossPipState.indexedPipRange;
            i++
        ) {
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                ammState.pipRangeLiquidityIndex
            ];
            // Init amm state
            if (ammReserves.baseReserve == 0 && ammReserves.baseReserve == 0) {
                ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ] = SwapState.AmmReserves({
                    baseReserve: liquidityInfo[uint256(i)].baseReal,
                    quoteReserve: liquidityInfo[uint256(i)].quoteReal
                });
                ammState.pipRangesIndex[
                    ammState.pipRangeLiquidityIndex
                ] = uint256(i);
                ammReserves = ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ];
            }

            if (
                ammState.lastPipRangeLiquidityIndex !=
                crossPipState.indexedPipRange
            ) {
                crossPipState.pipTargetStep = params.isBuy
                    ? liquidityInfo[uint256(i)].sqrtMaxPip
                    : liquidityInfo[uint256(i)].sqrtMinPip;
            } else {
                crossPipState.pipTargetStep = crossPipState.sqrtTargetPip;
            }

            (uint128 baseOut, uint128 quoteOut) = _calculateAmountOut(
                ammReserves,
                params.isBuy,
                crossPipState.pipTargetStep,
                (ammState.currentPip * CURVE_PIP).sqrt128()
            );

            /// This case for amount no reach pip
            /// Need find price stop
            if ((params.isBase && params.amount < baseOut) || (!params.isBase && params.amount < quoteOut)) {
                baseCrossPipOut += baseOut;
                quoteCrossPipOut += quoteOut;
                //update state
                break;
            }



            if (params.isBuy) {
                ammState
                    .ammReserves[ammState.pipRangeLiquidityIndex]
                    .baseReserve -= baseOut;
                ammState
                    .ammReserves[ammState.pipRangeLiquidityIndex]
                    .quoteReserve += quoteOut;
            } else {
                ammState
                    .ammReserves[ammState.pipRangeLiquidityIndex]
                    .baseReserve += baseOut;
                ammState
                    .ammReserves[ammState.pipRangeLiquidityIndex]
                    .quoteReserve -= quoteOut;
            }
            if (params.isBase) {} else {}
        }

        return (0, 0, 0, 0);
    }

    function _onCrossPipAMMNoTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        view
        returns (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint8 pipRangeLiquidityIndex,
            uint128 toPip
        )
    {
        return (0, 0, 0, 0);
    }

    function _calculateAmountOut(
        SwapState.AmmReserves memory ammReserves,
        bool isBuy,
        uint128 sqrtCurrentPrice,
        uint128 sqrtPriceTarget
    ) internal pure returns (uint128 baseOut, uint128 quoteOut) {
        if (isBuy) {
            baseOut = LiquidityMath.calculateBaseWithPriceWhenBuy(
                sqrtPriceTarget,
                ammReserves.baseReserve,
                sqrtCurrentPrice
            );
            quoteOut = LiquidityMath.calculateQuoteWithPriceWhenBuy(
                sqrtPriceTarget,
                ammReserves.baseReserve,
                sqrtCurrentPrice
            );
        } else {
            baseOut = LiquidityMath.calculateBaseWithPriceWhenSell(
                sqrtPriceTarget,
                ammReserves.quoteReserve,
                sqrtCurrentPrice
            );
            quoteOut = LiquidityMath.calculateQuoteWithPriceWhenSell(
                sqrtPriceTarget,
                ammReserves.quoteReserve,
                sqrtCurrentPrice
            );
        }
    }

    function _updateAmmState(
        uint128 baseAmount,
        uint128 quoteAmount,
        uint32 indexedPipRange,
        bool isBuy
    ) internal {
        Liquidity.Info memory _liquidityInfo = liquidityInfo[indexedPipRange];
        if (isBuy) {
            _liquidityInfo.baseVirtual =
                _liquidityInfo.baseVirtual -
                baseAmount;
            _liquidityInfo.baseReal = _liquidityInfo.baseReal - baseAmount;

            _liquidityInfo.quoteVirtual =
                _liquidityInfo.quoteVirtual +
                quoteAmount;
            _liquidityInfo.quoteReal = _liquidityInfo.quoteReal + quoteAmount;
        } else {
            _liquidityInfo.baseVirtual =
                _liquidityInfo.baseVirtual +
                baseAmount;
            _liquidityInfo.baseReal = _liquidityInfo.baseReal + baseAmount;

            _liquidityInfo.quoteVirtual =
                _liquidityInfo.quoteVirtual -
                quoteAmount;
            _liquidityInfo.quoteReal = _liquidityInfo.quoteReal - quoteAmount;
        }

        uint128 sqrtK = (_liquidityInfo.baseReal * _liquidityInfo.quoteReal)
            .sqrt128();
    }
}
