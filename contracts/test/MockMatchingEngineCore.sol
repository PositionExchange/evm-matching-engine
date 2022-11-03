/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../implement/MatchingEngineCore.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockMatchingEngineCore is MatchingEngineCore {
    using LiquidityBitmap for mapping(uint128 => uint256);

    bool isInitialized;

    function initialize(
        IERC20 quoteAsset,
        IERC20 baseAsset,
        uint256 basisPoint,
        uint256 baseBasisPoint,
        uint128 maxFindingWordsIndex,
        uint128 initialPip,
        uint128 pipRange,
        uint32 tickSpace,
        address owner,
        address positionLiquidity
    ) external {
        require(!isInitialized, "Initialized");
        isInitialized = true;

        _initializeCore(
            basisPoint,
            baseBasisPoint,
            maxFindingWordsIndex,
            initialPip
        );
    }

    function emitEventSwap(
        bool isBuy,
        uint256 _baseAmount,
        uint256 _quoteAmount,
        address _trader
    ) internal override(MatchingEngineCore) {
        uint256 amount0In;
        uint256 amount1In;
        uint256 amount0Out;
        uint256 amount1Out;

        if (isBuy) {
            amount1In = _quoteAmount;
            amount0Out = _baseAmount;
        } else {
            amount0In = _baseAmount;
            amount1Out = _quoteAmount;
        }
        emit Swap(
            msg.sender,
            amount0In,
            amount1In,
            amount0Out,
            amount1Out,
            _trader
        );
    }

    function getCurrentPip()
        external
        view
        override(MatchingEngineCore)
        returns (uint128)
    {
        return singleSlot.pip;
    }

    function getLiquidityInPipRange(
        uint128 fromPip,
        uint256 dataLength,
        bool toHigher
    )
        external
        view
        override(MatchingEngineCore)
        returns (LiquidityOfEachPip[] memory, uint128)
    {
        uint128[] memory allInitializedPip = new uint128[](uint128(dataLength));
        allInitializedPip = liquidityBitmap.findAllLiquidityInMultipleWords(
            fromPip,
            dataLength,
            toHigher
        );
        LiquidityOfEachPip[] memory allLiquidity = new LiquidityOfEachPip[](
            dataLength
        );

        for (uint256 i = 0; i < dataLength; i++) {
            allLiquidity[i] = LiquidityOfEachPip({
                pip: allInitializedPip[i],
                liquidity: tickPosition[allInitializedPip[i]].liquidity
            });
        }
        return (allLiquidity, allInitializedPip[dataLength - 1]);
    }
}
