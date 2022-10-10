/**
 * @author Musket
 */
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";
import "../libraries/helper/LiquidityMath.sol";


abstract contract AutoMarketMakerCore is AMMCoreStorage {

    using Liquidity for mapping(uint64 => Liquidity.Info);

    function initializeAMM(
        uint256 _pipRange,
        uint256 _liquidity,
        uint32 _tickSpace
    ) internal {
        pipRange = _pipRange;
        //        liquidity = _liquidity;
        tickSpace = _tickSpace;
    }

    function addLiquidity(
        uint128 baseAmount,
        uint128 quoteAmount,
        uint32 indexedPipRange
    )
        external
        virtual
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint32 liquidity
        )
    {
        Liquidity.Info memory _liquidityInfo = liquidityInfo[indexedPipRange];

        uint128 currentPrice = getCurrentPrice();

        if (_liquidityInfo.sqrtMaxPip == 0) {
            // TODO calculate Pmax and Pmin

            (uint128 pipMin, uint128 pipMax) = LiquidityMath.calculatePipRange(indexedPipRange, pipRange);
            currentIndexedPipRange = indexedPipRange;
        }else {
            uint128 baseReal =  LiquidityMath.calculateBaseReal(_liquidityInfo.sqrtMaxPip, _liquidityInfo.baseVirtual**2+baseAmount, currentPrice);
            uint128 quoteReal =  LiquidityMath.calculateQuoteReal(_liquidityInfo.sqrtMinPip, _liquidityInfo.quoteVirtual**2+quoteAmount, currentPrice);
            uint128 k = baseReal * quoteReal;

        }
    }

    function removeLiquidity(uint256 liquidityId) external virtual {}

    function modifyLiquidity(
        uint256 liquidityId,
        uint256 baseAmount,
        uint256 quoteAmount
    ) external virtual {}


    function getCurrentPrice() internal view virtual returns (uint128) { }
}
