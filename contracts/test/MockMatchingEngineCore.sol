/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../implement/MatchingEngineCore.sol";

contract MockMatchingEngineCore is MatchingEngineCore {
    bool isInitialized;

    function initialize(
        address quoteAsset,
        address baseAsset,
        uint256 basisPoint,
        uint256 baseBasisPoint,
        uint128 maxFindingWordsIndex,
        uint128 initialPip,
        uint128 pipRange,
        uint32 tickSpace,
        address owner
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
}
