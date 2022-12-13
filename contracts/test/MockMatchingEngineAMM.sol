/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../MatchingEngineAMM.sol";

contract MockMatchingEngineAMM is MatchingEngineAMM {
    function setCurrentPip(uint128 currentPip) public {
        singleSlot.pip = currentPip;
        currentIndexedPipRange = LiquidityMath.calculateIndexPipRange(
            currentPip,
            pipRange
        );
    }

    function setCounterParty() public {
        counterParties[msg.sender] = true;
    }
}
