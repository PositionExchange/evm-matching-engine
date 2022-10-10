/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library Liquidity {
    struct Info {
        uint128 sqrtMaxPip;
        uint128 sqrtMinPip;
        uint128 quoteVirtual;
        uint128 baseVirtual;
        uint128 sqrtQuoteReal;
        uint128 sqrtBaseReal;
        uint32 indexedPipRanger;
        uint256 feeGrowthBase;
        uint128 feeGrowthQuote;
        uint128 sqrtK;
    }

    function updateLiquidity(
        Liquidity.Info storage liquidityInfo,
        uint128 quoteVirtual,
        uint128 baseVirtual,
        uint128 quoteReal,
        uint128 baseReal,
        uint128 sqrtK
    ) internal {
        liquidityInfo.quoteVirtual = quoteVirtual;
        liquidityInfo.baseVirtual = baseVirtual;
        liquidityInfo.sqrtQuoteReal = sqrtQuoteReal;
        liquidityInfo.sqrtBaseReal = sqrtBaseReal;
        liquidityInfo.sqrtK = sqrtK;
    }

    function updateFeeGrowth(
        Liquidity.Info storage liquidityInfo,
        uint256 feeGrowthBase,
        uint256 feeGrowthQuote
    ) internal {
        liquidityInfo.feeGrowthBase = feeGrowthBase;
        liquidityInfo.feeGrowthQuote = feeGrowthQuote;

    }
}
