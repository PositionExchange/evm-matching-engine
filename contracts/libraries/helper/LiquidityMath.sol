/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library LiquidityMath {
    function calculateBaseReal(
        uint128 sqrtMaxPip,
        uint128 xVirtual,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return (sqrtMaxPip * xVirtual) / (sqrtMaxPip - sqrtCurrentPrice);
    }

    function calculateQuoteReal(
        uint128 sqrtMinPip,
        uint128 yVirtual,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return (sqrtCurrentPrice * yVirtual) / (sqrtCurrentPrice - sqrtMinPip);
    }

    /// these functions below are used to calculate the amount asset when SELL
    function calculateBaseWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            (quoteReal * (sqrtCurrentPrice - sqrtPriceTarget)) /
            (sqrtPriceTarget * sqrtCurrentPrice**2);
    }

    function calculateQuoteWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            (quoteReal * (sqrtCurrentPrice - sqrtPriceTarget)) /
            sqrtCurrentPrice;
    }

    function calculateBaseWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            (baseReal * (sqrtPriceTarget - sqrtCurrentPrice)) / sqrtPriceTarget;
    }

    function calculateQuoteWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            baseReal * sqrtCurrentPrice * (sqrtPriceTarget - sqrtCurrentPrice);
    }

    function calculateIndexPipRange(uint128 pip, uint128 pipRange)
        internal
        pure
        returns (uint256)
    {
        return
            pip % pipRange == 0
                ? uint256((pip / pipRange) + 1)
                : uint256(pip / pipRange);
    }

    function calculatePriceTargetWithBaseWhenBuy(
        uint128 sqrtCurrentPrice,
        uint128 baseReal,
        uint128 baseVirtual
    ) internal pure returns (uint128) {
        return (baseReal * sqrtCurrentPrice) / (baseReal - baseVirtual);
    }

    function calculatePriceTargetWithQuoteWhenBuy(
        uint128 sqrtCurrentPrice,
        uint128 baseReal,
        uint128 quoteVirtual
    ) internal pure returns (uint128) {
        return
            (quoteVirtual + baseReal * sqrtCurrentPrice**2) /
            (baseReal * sqrtCurrentPrice);
    }

    function calculatePriceTargetWithBaseWhenSell(
        uint128 sqrtCurrentPrice,
        uint128 quoteReal,
        uint128 baseVirtual
    ) internal pure returns (uint128) {
        return
            (quoteReal * sqrtCurrentPrice) /
            (baseVirtual * sqrtCurrentPrice**2 + quoteReal);
    }

    function calculatePriceTargetWithQuoteWhenSell(
        uint128 sqrtCurrentPrice,
        uint128 quoteReal,
        uint128 quoteVirtual
    ) internal pure returns (uint128) {
        return
            (quoteReal * sqrtCurrentPrice - quoteVirtual * sqrtCurrentPrice) /
            (quoteReal);
    }

    function calculatePipRange(uint32 indexedPipRange, uint128 pipRange)
        internal
        pure
        returns (uint128 pipMin, uint128 pipMax)
    {
        pipMin = indexedPipRange * pipRange;
        pipMax = pipMin + pipRange - 1;
    }

    function calculateBaseBuyAndQuoteSellWithoutTargetPrice(
        uint128 sqrtK,
        uint128 amountReal,
        uint128 amount
    ) internal pure returns (uint128) {
        return (amount * amountReal**2) / (sqrtK**2 + sqrtK**2 * amountReal);
    }

    function calculateQuoteBuyAndBaseSellWithoutTargetPrice(
        uint128 sqrtK,
        uint128 amountReal,
        uint128 amount
    ) internal pure returns (uint128) {
        return (amount * sqrtK**2) / (amountReal * (amountReal - amount));
    }

    function calculateKWithQuote(uint128 quoteReal, uint128 sqrtPriceMax)
        internal
        pure
        returns (uint128)
    {
        return quoteReal**2 / sqrtPriceMax**2;
    }

    function calculateKWithBase(uint128 baseReal, uint128 sqrtPriceMin)
        internal
        pure
        returns (uint128)
    {
        return baseReal**2 * sqrtPriceMin**2;
    }

    function calculateKWithBaseAndQuote(uint128 quoteReal, uint128 baseReal)
        internal
        pure
        returns (uint128)
    {
        return quoteReal * baseReal;
    }

    function calculateLiquidity(
        uint128 amountReal,
        uint128 sqrtPrice,
        bool isBase
    ) internal pure returns (uint128) {
        if (isBase) {
            return amountReal * sqrtPrice;
        } else {
            return amountReal / sqrtPrice;
        }
    }

    function calculateBaseByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMax,
        uint128 sqrtPrice
    ) internal pure returns (uint128) {
        return
            (liquidity * (sqrtPriceMax - sqrtPrice)) /
            (sqrtPrice * sqrtPriceMax);
    }

    function calculateQuoteByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMin,
        uint128 sqrtPrice
    ) internal pure returns (uint128) {
        return liquidity * (sqrtPrice - sqrtPriceMin);
    }
}
