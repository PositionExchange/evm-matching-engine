/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

interface IAutoMarketMakerCore {
    // TODO add guard

    struct AddLiquidity {
        uint128 baseAmount;
        uint128 quoteAmount;
        uint32 indexedPipRange;
        }

    function addLiquidity(
        AddLiquidity calldata params
    )
        external
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint128 liquidity,
            uint256 feeGrowthBase,
            uint256 feeGrowthQuote
        );

    struct RemoveLiquidity {
        uint128 liquidity;
        uint32 indexedPipRange;
        uint256 feeGrowthBase;
        uint256 feeGrowthQuote;
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        external
        returns (uint128 baseAmount, uint128 quoteAmount);
}
