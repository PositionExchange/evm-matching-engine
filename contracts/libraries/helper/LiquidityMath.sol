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
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal
    ) internal pure returns (uint128) {
        return
            ((sqrtPriceTarget * sqrtBaseReal * sqrtQuoteReal) /
                (sqrtPriceTarget**2)) - (sqrtBaseReal**2);
    }

    function calculateBaseWithoutPriceWhenSell(
        uint128 liquidity,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal,
        uint128 amountQuote
    ) internal pure returns (uint128) {
        return (liquidity / (sqrtQuoteReal**2 - amountQuote)) - sqrtBaseReal**2;
    }

    function calculateQuoteWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal
    ) internal pure returns (uint128) {
        return
            sqrtQuoteReal**2 - sqrtPriceTarget * sqrtBaseReal * sqrtQuoteReal;
    }

    function calculateQuoteWithoutPriceWhenSell(
        uint128 liquidity,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal,
        uint128 amountBase
    ) internal pure returns (uint128) {
        return sqrtQuoteReal**2 - (liquidity / (sqrtBaseReal**2 - amountBase));
    }

    /// these functions below are used to calculate the amount asset when BUY

    function calculateBaseWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal
    ) internal pure returns (uint128) {
        return
            sqrtBaseReal**2 -
            (sqrtPriceTarget * sqrtBaseReal * sqrtQuoteReal) /
            sqrtPriceTarget**2;
    }

    function calculateBaseWithoutPriceWhenBuy(
        uint128 liquidity,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal,
        uint128 amountQuote
    ) internal pure returns (uint128) {
        return sqrtBaseReal**2 - (liquidity / (sqrtQuoteReal**2 - amountQuote));
    }

    function calculateQuoteWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal
    ) internal pure returns (uint128) {
        return
            sqrtPriceTarget * sqrtBaseReal * sqrtQuoteReal - sqrtQuoteReal**2;
    }

    function calculateQuoteWithoutPriceWhenBuy(
        uint128 liquidity,
        uint128 sqrtBaseReal,
        uint128 sqrtQuoteReal,
        uint128 amountQuote
    ) internal pure returns (uint128) {
        return sqrtQuoteReal**2 - (liquidity / (sqrtBaseReal**2 - amountQuote));
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
