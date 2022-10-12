/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

interface IAutoMarketMakerCore {
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

    function removeLiquidity(uint128 liquidity, uint32 indexedPipRange)
        external
        returns (uint128 baseAmount, uint128 quoteAmount);

    function modifyLiquidity(
        uint256 baseAmount,
        uint256 quoteAmount,
        uint32 indexedPipRange,
        uint8 modifyType
    )
        external
        returns (
            uint128 newLiquidity,
            uint256 newBaseAmount,
            uint256 newQuoteAmount
        );
}
