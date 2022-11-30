/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library Require {
    function _require(bool condition, string memory reason) internal {
        require(condition, reason);
    }
}
