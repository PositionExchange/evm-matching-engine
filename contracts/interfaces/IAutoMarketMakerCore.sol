/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../libraries/helper/Liquidity.sol";

interface IAutoMarketMakerCore {
    // TODO add guard

    struct AddLiquidity {
        uint128 baseAmount;
        uint128 quoteAmount;
        uint32 indexedPipRange;
    }

    function addLiquidity(AddLiquidity calldata params)
        external
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint256 liquidity,
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

    function estimateRemoveLiquidity(RemoveLiquidity calldata params)
        external
        view
        returns (
            uint128 baseAmount,
            uint128 quoteAmount,
            Liquidity.Info memory _liquidityInfo
        );

    function getPipRange() external view returns (uint128);

    function liquidityInfo(uint256 index)
        external
        view
        returns (
            uint128 sqrtMaxPip,
            uint128 sqrtMinPip,
            uint128 quoteReal,
            uint128 baseReal,
            uint32 indexedPipRange,
            uint256 feeGrowthBase,
            uint256 feeGrowthQuote,
            uint128 sqrtK
        );

    function pipRange() external view returns (uint128);

    function tickSpace() external view returns (uint32);

    function currentIndexedPipRange() external view returns (uint256);

    function feeShareAmm() external view returns (uint32);
}
