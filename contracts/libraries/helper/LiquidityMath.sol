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
        returns (uint32)
    {
        return
            pip % pipRange == 0
                ? uint32((pip / pipRange) + 1)
                : uint32(pip / pipRange);
    }

    function calculatePipRange(uint32 indexedPipRange, uint128 pipRange)
        internal
        pure
        returns (uint128 pipMin, uint128 pipMax)
    {
        pipMin = indexedPipRange * pipRange;
        pipMax = pipMin + pipRange - 1;
    }
}
