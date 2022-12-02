/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "../libraries/helper/LiquidityMath.sol";

contract LiquidityMathTest {
    uint256 public CURVE_PIP = 10**24;
    uint128 public basisPoint = 10000;

    function calculateBaseReal(
        uint128 maxPip,
        uint128 xVirtual,
        uint128 currentPrice
    ) public view returns (uint128) {
        uint128 sqrtMaxPip = _calculateSqrtPrice(maxPip, CURVE_PIP);
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(currentPrice, CURVE_PIP);

        return
            LiquidityMath.calculateBaseReal(
                sqrtMaxPip,
                xVirtual,
                sqrtCurrentPrice
            );
    }

    function calculateQuoteReal(
        uint128 sqrtMinPip,
        uint128 yVirtual,
        uint128 sqrtCurrentPrice
    ) public view returns (uint128) {
        uint128 sqrtMinPip = _calculateSqrtPrice(sqrtMinPip, CURVE_PIP);
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(
            sqrtCurrentPrice,
            CURVE_PIP
        );

        return
            LiquidityMath.calculateQuoteReal(
                sqrtMinPip,
                yVirtual,
                sqrtCurrentPrice
            );
    }

    function calculateBaseWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) public view returns (uint128) {
        uint128 sqrtPriceTarget = _calculateSqrtPrice(
            sqrtPriceTarget,
            CURVE_PIP
        );
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(
            sqrtCurrentPrice,
            CURVE_PIP
        );

        return
            LiquidityMath.calculateBaseWithPriceWhenSell(
                sqrtPriceTarget,
                quoteReal,
                sqrtCurrentPrice
            ) * basisPoint;
    }

    function calculateQuoteWithPriceWhenSell(
        uint128 sqrtPriceTarget,
        uint128 quoteReal,
        uint128 sqrtCurrentPrice
    ) public view returns (uint128) {
        uint128 sqrtPriceTarget = _calculateSqrtPrice(
            sqrtPriceTarget,
            CURVE_PIP
        );
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(
            sqrtCurrentPrice,
            CURVE_PIP
        );

        return
            LiquidityMath.calculateQuoteWithPriceWhenSell(
                sqrtPriceTarget,
                quoteReal,
                sqrtCurrentPrice
            );
    }

    function calculateBaseWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) public view returns (uint128) {
        uint128 sqrtPriceTarget = _calculateSqrtPrice(
            sqrtPriceTarget,
            CURVE_PIP
        );
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(
            sqrtCurrentPrice,
            CURVE_PIP
        );

        return
            LiquidityMath.calculateBaseWithPriceWhenBuy(
                sqrtPriceTarget,
                baseReal,
                sqrtCurrentPrice
            );
    }

    function calculateQuoteWithPriceWhenBuy(
        uint128 sqrtPriceTarget,
        uint128 baseReal,
        uint128 sqrtCurrentPrice
    ) public view returns (uint256) {
        uint128 sqrtPriceTarget = _calculateSqrtPrice(
            sqrtPriceTarget,
            CURVE_PIP
        );
        uint128 sqrtCurrentPrice = _calculateSqrtPrice(
            sqrtCurrentPrice,
            CURVE_PIP
        );
        return
            LiquidityMath.calculateQuoteWithPriceWhenBuy(
                sqrtPriceTarget,
                baseReal,
                sqrtCurrentPrice
            ) / basisPoint;
    }

    function calculateLiquidity(
        uint128 amountReal,
        uint128 sqrtPrice,
        bool isBase
    ) public view returns (uint256) {
        uint128 sqrtPrice = _calculateSqrtPrice(sqrtPrice, CURVE_PIP);
        return LiquidityMath.calculateLiquidity(amountReal, sqrtPrice, isBase);
    }

    function calculateBaseByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMax,
        uint128 sqrtPrice
    ) public view returns (uint128) {
        uint128 sqrtPriceMax = _calculateSqrtPrice(sqrtPriceMax, CURVE_PIP);
        uint128 sqrtPrice = _calculateSqrtPrice(sqrtPrice, CURVE_PIP);
        return
            LiquidityMath.calculateBaseByLiquidity(
                liquidity,
                sqrtPriceMax,
                sqrtPrice
            );
    }

    function calculateQuoteByLiquidity(
        uint128 liquidity,
        uint128 sqrtPriceMin,
        uint128 sqrtPrice
    ) public view returns (uint128) {
        uint128 sqrtPriceMin = _calculateSqrtPrice(sqrtPriceMin, CURVE_PIP);
        uint128 sqrtPrice = _calculateSqrtPrice(sqrtPrice, CURVE_PIP);
        return
            LiquidityMath.calculateQuoteByLiquidity(
                liquidity,
                sqrtPriceMin,
                sqrtPrice
            );
    }

    function _calculateSqrtPrice(uint128 pip, uint256 curve)
        internal
        view
        returns (uint128)
    {
        return uint128(sqrt(uint256(pip) * curve));
    }

    /// @notice Calculates the square root of x, rounding down.
    /// @dev Uses the Babylonian method https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method.
    /// @param x The uint256 number for which to calculate the square root.
    /// @return result The result as an uint256.
    function sqrt(uint256 x) internal pure returns (uint256 result) {
        if (x == 0) {
            return 0;
        }

        // Calculate the square root of the perfect square of a power of two that is the closest to x.
        uint256 xAux = uint256(x);
        result = 1;
        if (xAux >= 0x100000000000000000000000000000000) {
            xAux >>= 128;
            result <<= 64;
        }
        if (xAux >= 0x10000000000000000) {
            xAux >>= 64;
            result <<= 32;
        }
        if (xAux >= 0x100000000) {
            xAux >>= 32;
            result <<= 16;
        }
        if (xAux >= 0x10000) {
            xAux >>= 16;
            result <<= 8;
        }
        if (xAux >= 0x100) {
            xAux >>= 8;
            result <<= 4;
        }
        if (xAux >= 0x10) {
            xAux >>= 4;
            result <<= 2;
        }
        if (xAux >= 0x8) {
            result <<= 1;
        }

        // The operations can never overflow because the result is max 2^127 when it enters this block.
        unchecked {
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1; // Seven iterations should be enough
            uint256 roundedDownResult = x / result;
            return result >= roundedDownResult ? roundedDownResult : result;
        }
    }
}
