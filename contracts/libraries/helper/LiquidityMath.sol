/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./FixedPoint128.sol";

library LiquidityMath {
    function calculateBaseReal(
        uint128 sqrtMaxPip,
        uint128 xVirtual,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        if (sqrtCurrentPrice == sqrtMaxPip) {
            return 0;
        }
        return
            uint128(
                (uint256(sqrtMaxPip) * uint256(xVirtual)) /
                    (uint256(sqrtMaxPip) - uint256(sqrtCurrentPrice))
            );
    }

    function calculateQuoteReal(
        uint128 sqrtMinPip,
        uint128 yVirtual,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        if (sqrtCurrentPrice == sqrtMinPip) {
            return 0;
        }
        return
            uint128(
                (uint256(sqrtCurrentPrice) * uint256(yVirtual)) /
                    (uint256(sqrtCurrentPrice) - uint256(sqrtMinPip))
            );
    }

    /// these functions below are used to calculate the amount asset when SELL
    function calculateBaseWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        //        return uint128(((10**18 * uint256(quoteReal)) / uint256(sqrtPriceTarget) ) * (10**18 *((uint256(quoteReal) *
        //        (uint256(sqrtCurrentPrice) -
        //        uint256(sqrtPriceTarget))))/uint256(sqrtCurrentPrice)**2));

        //        uint256 a = (10**18 *
        //            (uint256(quoteReal) *
        //                (uint256(sqrtCurrentPrice) - uint256(sqrtPriceTarget))));
        //        uint256 b = (uint256(sqrtPriceTarget) * uint256(sqrtCurrentPrice)**2);

        return
            uint128(
                (FixedPoint128.BUFFER *
                    (uint256(quoteReal) *
                        (uint256(sqrtCurrentPrice) -
                            uint256(sqrtPriceTarget)))) /
                    (uint256(sqrtPriceTarget) * uint256(sqrtCurrentPrice)**2)
            );
    }

    function calculateQuoteWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(quoteReal) *
                    (uint256(sqrtCurrentPrice) - uint256(sqrtPriceTarget))) /
                    uint256(sqrtCurrentPrice)
            );
    }

    function calculateBaseWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(baseReal) *
                    (uint256(sqrtPriceTarget) - uint256(sqrtCurrentPrice))) /
                    uint256(sqrtPriceTarget)
            );
    }

    function calculateQuoteWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(baseReal) *
                    uint256(sqrtCurrentPrice) *
                    (uint256(sqrtPriceTarget) - uint256(sqrtCurrentPrice))) /
                    FixedPoint128.BUFFER
            );
    }

    function calculateIndexPipRange(uint128 pip, uint128 pipRange)
        internal
        pure
        returns (uint256)
    {
        return uint256(pip / pipRange);
        //            pip % pipRange == 0
        //                ? uint256((pip / pipRange) )
        //                : uint256(pip / pipRange);
    }

    function calculatePipRange(uint32 indexedPipRange, uint128 pipRange)
        internal
        pure
        returns (uint128 pipMin, uint128 pipMax)
    {
        pipMin = indexedPipRange == 0 ? 1 : indexedPipRange * pipRange;
        pipMax = pipMin + pipRange - 1;
    }

    function calculateBaseBuyAndQuoteSellWithoutTargetPrice(
        uint128 sqrtK,
        uint128 amountReal,
        uint128 amount
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(amount) * uint256(amountReal)**2) /
                    (uint256(sqrtK)**2 + amount * uint256(amountReal))
            );
    }

    function calculateQuoteBuyAndBaseSellWithoutTargetPrice(
        uint128 sqrtK,
        uint128 amountReal,
        uint128 amount
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(amount) * uint256(sqrtK)**2) /
                    (uint256(amountReal) *
                        (uint256(amountReal) - uint256(amount)))
            );
    }

    function calculateKWithQuote(uint128 quoteReal, uint128 sqrtPriceMax)
        internal
        pure
        returns (uint256)
    {
        return
            (uint256(quoteReal)**2 * FixedPoint128.BUFFER) /
            uint256(sqrtPriceMax)**2;
    }

    function calculateKWithBase(uint128 baseReal, uint128 sqrtPriceMin)
        internal
        pure
        returns (uint256)
    {
        return
            (uint256(baseReal)**2 * uint256(sqrtPriceMin)**2) /
            FixedPoint128.BUFFER;
    }

    function calculateKWithBaseAndQuote(uint128 quoteReal, uint128 baseReal)
        internal
        pure
        returns (uint256)
    {
        return uint256(quoteReal) * uint256(baseReal);
    }

    function calculateLiquidity(
        uint128 amountReal,
        uint128 sqrtPrice,
        bool isBase
    ) internal pure returns (uint256) {
        if (isBase) {
            return uint256(amountReal) * uint256(sqrtPrice);
        } else {
            return uint256(amountReal) / uint256(sqrtPrice);
        }
    }

    function calculateBaseByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMax,
        uint128 sqrtPrice
    ) internal pure returns (uint128) {
        return
            uint128(
                (FixedPoint128.HALF_BUFFER *
                    uint256(liquidity) *
                    (uint256(sqrtPriceMax) - uint256(sqrtPrice))) /
                    (uint256(sqrtPrice) * uint256(sqrtPriceMax))
            );
    }

    function calculateQuoteByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMin,
        uint128 sqrtPrice
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(liquidity) *
                    (uint256(sqrtPrice) - uint256(sqrtPriceMin))) /
                    FixedPoint128.HALF_BUFFER
            );
    }

    function calculateBaseRealByLiquidity(
        uint128 liquidity,
        uint128 totalLiquidity,
        uint128 totalBaseReal
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(liquidity) * totalBaseReal) / uint256(totalLiquidity)
            );
    }

    function calculateQuoteRealByLiquidity(
        uint128 liquidity,
        uint128 totalLiquidity,
        uint128 totalQuoteReal
    ) internal pure returns (uint128) {
        return
            uint128(
                (uint256(liquidity) * totalQuoteReal) / uint256(totalLiquidity)
            );
    }

    function calculateQuoteVirtualAmountFromBaseVirtualAmount(
        uint128 baseVirtualAmount,
        uint128 sqrtCurrentPrice,
        uint128 sqrtMaxPip,
        uint128 sqrtMinPip
    ) internal pure returns (uint128 quoteVirtualAmount) {
        return
            (baseVirtualAmount *
                sqrtCurrentPrice *
                (sqrtCurrentPrice - sqrtMinPip)) /
            (sqrtMaxPip * sqrtCurrentPrice);
    }

    function calculateBaseVirtualAmountFromQuoteVirtualAmount(
        uint128 quoteVirtualAmount,
        uint128 sqrtCurrentPrice,
        uint128 sqrtMaxPip,
        uint128 sqrtMinPip
    ) internal pure returns (uint128 baseVirtualAmount) {
        return
            (quoteVirtualAmount *
                sqrtCurrentPrice *
                (sqrtCurrentPrice - sqrtMinPip)) /
            ((sqrtCurrentPrice - sqrtMinPip) * sqrtCurrentPrice * sqrtMaxPip);
    }
}
