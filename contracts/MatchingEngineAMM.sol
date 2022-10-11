/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implement/MatchingEngineCore.sol";
import "./implement/AutoMarketMakerCore.sol";

contract MatchingEngineAMM is AutoMarketMakerCore, MatchingEngineCore {
    using Math for uint128;
    bool isInitialized;

    function initialize() external {
        require(!isInitialized, "Initialized");
        isInitialized = true;
    }

    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal override {}

    function _onCrossPipHook(
        uint128 pipNext,
        bool isBuy,
        bool isBase,
        uint128 amount
    ) internal view override returns (CrossPipResult memory crossPipResult) {
        (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint8 pipRangeLiquidityIndex,
            uint128 toPip
        ) = _onCrossPipAMM(pipNext, isBuy, isBase, amount);

        return CrossPipResult(0, 0, pipRangeLiquidityIndex, toPip);
    }

    function getUnderlyingPriceInPip()
        internal
        view
        override
        returns (uint256)
    {
        return 0;
    }
}
