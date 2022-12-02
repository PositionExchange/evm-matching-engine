// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

abstract contract Block {
    /// @notice get block timestamp
    function _blockTimestamp() internal view virtual returns (uint64) {
        return uint64(block.timestamp);
    }

    /// @notice get block number
    function _blockNumber() internal view virtual returns (uint64) {
        return uint64(block.number);
    }
}
