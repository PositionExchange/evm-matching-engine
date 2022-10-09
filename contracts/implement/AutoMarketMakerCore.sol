/**
 * @author Musket
 */
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";

abstract contract AutoMarketMakerCore is AMMCoreStorage {
    function initializeAMM(
        uint256 _pipRange,
        uint256 _liquidity,
        uint32 _tickSpace
    ) internal {
        pipRange = _pipRange;
        liquidity = _liquidity;
        tickSpace = _tickSpace;
    }

    function addLiquidity(
        uint256 baseAmount,
        uint256 quoteAmount,
        uint32 indexedPipRange
    ) external virtual {}

    function removeLiquidity(uint256 liquidityId) external virtual {}

    function modifyLiquidity(
        uint256 liquidityId,
        uint256 baseAmount,
        uint256 quoteAmount
    ) external virtual {}


}
