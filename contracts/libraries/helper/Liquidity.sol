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
        uint256 feeGrowthQuote;
        uint128 sqrtK;
    }

    function initNewPipRange(
        Liquidity.Info storage self,
        uint128 sqrtMaxPip,
        uint128 sqrtMinPip,
        uint32 indexedPipRange
    ) internal {
        self.sqrtMaxPip = sqrtMaxPip;
        self.sqrtMinPip = sqrtMinPip;
        self.indexedPipRanger = indexedPipRange;
    }

    function updateLiquidity(
        Liquidity.Info storage self,
        uint128 quoteVirtual,
        uint128 baseVirtual,
        uint128 sqrtQuoteReal,
        uint128 sqrtBaseReal,
        uint128 sqrtK
    ) internal {
        self.quoteVirtual = quoteVirtual;
        self.baseVirtual = baseVirtual;
        self.sqrtQuoteReal = sqrtQuoteReal;
        self.sqrtBaseReal = sqrtBaseReal;
        self.sqrtK = sqrtK;
    }

    function updateFeeGrowth(
        Liquidity.Info storage self,
        uint256 feeGrowthBase,
        uint256 feeGrowthQuote
    ) internal {
        self.feeGrowthBase = feeGrowthBase;
        self.feeGrowthQuote = feeGrowthQuote;
    }
}
