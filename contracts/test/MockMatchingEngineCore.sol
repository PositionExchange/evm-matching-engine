/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../implement/MatchingEngineCore.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IMatchingEngineAMM.sol";

contract MockMatchingEngineCore is MatchingEngineCore {
    using LiquidityBitmap for mapping(uint128 => uint256);

    bool isInitialized;

    function initialize(IMatchingEngineAMM.InitParams memory params) external {
        require(!isInitialized, "Initialized");
        isInitialized = true;

        _initializeCore(
            params.basisPoint,
            params.maxFindingWordsIndex,
            params.initialPip
        );
    }

    function emitEventSwap(
        bool _isBase,
        bool _isBuy,
        uint256 _mainSideOut,
        uint256 _flipSideOut,
        address _trader
    ) internal override(MatchingEngineCore) {
        uint256 amount0In;
        uint256 amount1In;
        uint256 amount0Out;
        uint256 amount1Out;

        if (_isBase) {
            if (_isBuy) {
                amount1In = _flipSideOut;
                amount0Out = _mainSideOut;
            } else {
                amount0In = _mainSideOut;
                amount1Out = _flipSideOut;
            }
        } else {
            if (_isBuy) {
                amount1In = _mainSideOut;
                amount0Out = _flipSideOut;
            } else {
                amount0In = _flipSideOut;
                amount1Out = _mainSideOut;
            }
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
