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

        uint128 currentPrice = getCurrentPrice();

        if (_liquidityInfo.sqrtMaxPip == 0) {
            (uint128 pipMin, uint128 pipMax) = LiquidityMath.calculatePipRange(
                indexedPipRange,
                pipRange
            );
            liquidityInfo[indexedPipRange].initNewPipRange(
                pipMax.sqrt128(),
                pipMin.sqrt128(),
                indexedPipRange
            );
        }

        uint128 baseReal = LiquidityMath.calculateBaseReal(
            _liquidityInfo.sqrtMaxPip,
            _liquidityInfo.baseVirtual**2 + baseAmount,
            currentPrice
        );
        uint128 quoteReal = LiquidityMath.calculateQuoteReal(
            _liquidityInfo.sqrtMinPip,
            _liquidityInfo.quoteVirtual**2 + quoteAmount,
            currentPrice
        );
        uint128 sqrtK = (baseReal * quoteReal).sqrt128();

        // TODO calculate liquidity
        return (0, 0, 0);
    }

    function removeLiquidity(uint128 liquidity, uint32 indexedPipRange)
        external
        virtual
        returns (uint128 baseAmount, uint128 quoteAmount)
    {
        return (0, 0);
    }

    function modifyLiquidity(
        uint256 baseAmount,
        uint256 quoteAmount,
        uint32 indexedPipRange,
        uint8 modifyType
    )
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
            uint128 sqrtTargetPip = pipNext.sqrt128();
            indexedPipRange = LiquidityMath.calculateIndexPipRange(
                pipNext,
                pipRange
            );
            Liquidity.Info memory _liquidityInfo = liquidityInfo[
                indexedPipRange
            ];
            // TODO check cross indexed pip range
            if (isBuy) {
                baseCrossPipOut = LiquidityMath.calculateBaseWithPriceWhenBuy(
                    sqrtTargetPip,
                    _liquidityInfo.sqrtBaseReal,
                    _liquidityInfo.sqrtQuoteReal
                );
                quoteCrossPipOut = LiquidityMath.calculateQuoteWithPriceWhenBuy(
                        sqrtTargetPip,
                        _liquidityInfo.sqrtBaseReal,
                        _liquidityInfo.sqrtQuoteReal
                    );
            } else {
                baseCrossPipOut = LiquidityMath.calculateBaseWithPriceWhenSell(
                    sqrtTargetPip,
                    _liquidityInfo.sqrtBaseReal,
                    _liquidityInfo.sqrtQuoteReal
                );
                quoteCrossPipOut = LiquidityMath
                    .calculateQuoteWithPriceWhenSell(
                        sqrtTargetPip,
                        _liquidityInfo.sqrtBaseReal,
                        _liquidityInfo.sqrtQuoteReal
                    );
            }
        } else if (pipNext != 0) {
            if (isBuy) {} else {}
        }
        return (0, 0, 0, 0);
    }
}
