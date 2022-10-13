/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

interface IAutoMarketMakerCore {
    // TODO add guard

    function addLiquidity(
        uint128 baseAmount,
        uint128 quoteAmount,
        uint32 indexedPipRange
    )
        external
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint32 liquidity
        );

    struct RemoveLiquidity {
        uint128 baseVirtual;
        uint128 quoteVirtual;
        uint128 liquidity;
        uint32 indexedPipRange;
        uint256 feeGrowthBase;
        uint256 feeGrowthQuote;
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        external
        returns (uint128 baseAmount, uint128 quoteAmount);

    struct ModifyLiquidity {
        uint128 quoteAmount;
        uint128 baseAmount;
        uint32 indexedPipRange;
        uint8 modifyType;
    }

    function modifyLiquidity(ModifyLiquidity calldata params)
        external
        returns (
            uint128 newLiquidity,
            uint256 newBaseAmount,
            uint256 newQuoteAmount
        );
}
