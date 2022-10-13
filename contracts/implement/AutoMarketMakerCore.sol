/**
 * @author Musket
 */
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";
import "../libraries/helper/Math.sol";
import "../libraries/helper/LiquidityMath.sol";
import "../interfaces/IAutoMarketMakerCore.sol";

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

    function _onCrossPipAMM(
        uint128 pipNext,
        bool isBuy,
        bool isBase,
        uint128 amount
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
        uint32 indexedPipRange;
        // Have target price
        if (pipNext != 0) {
            //            uint128 sqrtTargetPip = pipNext.sqrt128();
            //            indexedPipRange = LiquidityMath.calculateIndexPipRange(
            //                pipNext,
            //                pipRange
            //            );
            //            Liquidity.Info memory _liquidityInfo = liquidityInfo[
            //                indexedPipRange
            //            ];
            //            // TODO check cross indexed pip range
            //            if (isBuy) {
            //                baseCrossPipOut = LiquidityMath.calculateBaseWithPriceWhenBuy(
            //                    sqrtTargetPip,
            //                    _liquidityInfo.baseReal,
            //                    _liquidityInfo.quoteReal
            //                );
            //                quoteCrossPipOut = LiquidityMath.calculateQuoteWithPriceWhenBuy(
            //                        sqrtTargetPip,
            //                        _liquidityInfo.baseReal,
            //                        _liquidityInfo.quoteReal
            //                    );
            //            } else {
            //                baseCrossPipOut = LiquidityMath.calculateBaseWithPriceWhenSell(
            //                    sqrtTargetPip,
            //                    _liquidityInfo.baseReal,
            //                    _liquidityInfo.quoteReal
            //                );
            //                quoteCrossPipOut = LiquidityMath
            //                    .calculateQuoteWithPriceWhenSell(
            //                        sqrtTargetPip,
            //                        _liquidityInfo.baseReal,
            //                        _liquidityInfo.quoteReal
            //                    );
            //            }
        } else if (pipNext == 0) {
            //            Liquidity.Info memory _liquidityInfo = liquidityInfo[
            //                currentIndexedPipRange
            //            ];
            //
            //            if (isBuy) {
            //                if (isBase) {
            //                    quoteCrossPipOut = LiquidityMath
            //                        .calculateQuoteWithoutPriceWhenBuy(
            //                            _liquidityInfo.sqrtK,
            //                            _liquidityInfo.baseReal,
            //                            _liquidityInfo.quoteReal,
            //                            amount
            //                        );
            //                    baseCrossPipOut = amount;
            //                } else {
            //                    baseCrossPipOut = LiquidityMath
            //                        .calculateBaseWithoutPriceWhenBuy(
            //                            _liquidityInfo.sqrtK,
            //                            _liquidityInfo.baseReal,
            //                            _liquidityInfo.quoteReal,
            //                            amount
            //                        );
            //                    quoteCrossPipOut = amount;
            //                }
            //            } else {
            //                if (isBase) {
            //                    quoteCrossPipOut = LiquidityMath
            //                        .calculateQuoteWithoutPriceWhenSell(
            //                            _liquidityInfo.sqrtK,
            //                            _liquidityInfo.baseReal,
            //                            _liquidityInfo.quoteReal,
            //                            amount
            //                        );
            //                    baseCrossPipOut = amount;
            //                } else {
            //                    baseCrossPipOut = LiquidityMath
            //                        .calculateBaseWithoutPriceWhenSell(
            //                            _liquidityInfo.sqrtK,
            //                            _liquidityInfo.baseReal,
            //                            _liquidityInfo.quoteReal,
            //                            amount
            //                        );
            //                    quoteCrossPipOut = amount;
            //                }
            //            }
        }
        return (0, 0, 0, 0);
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
