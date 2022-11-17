/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

contract ReserveSnapshots {
    struct ReserveSnapshot {
        uint128 pip;
        uint64 timestamp;
        uint64 blockNumber;
    }

    ReserveSnapshot[] public reserveSnapshots;

    event ReserveSnapshotted(uint128 pip, uint256 timestamp);

    function _initReserveSnapshot(uint128 _initialPip) internal {
        reserveSnapshots.push(
            ReserveSnapshot(
                _initialPip,
                uint64(block.timestamp),
                uint64(block.number)
            )
        );
    }

    function _blockNumber() internal view virtual returns (uint64) {
        return uint64(block.number);
    }

    function _blockTimestamp() internal view virtual returns (uint64) {
        return uint64(block.timestamp);
    }

    function _addReserveSnapshot() internal virtual {
        uint128 currentPip = _getCurrentPip();
        uint64 currentBlock = _blockNumber();
        ReserveSnapshot memory latestSnapshot = reserveSnapshots[
            reserveSnapshots.length - 1
        ];
        if (currentBlock == latestSnapshot.blockNumber) {
            reserveSnapshots[reserveSnapshots.length - 1].pip = currentPip;
        } else {
            reserveSnapshots.push(
                ReserveSnapshot(currentPip, _blockTimestamp(), currentBlock)
            );
        }
        emit ReserveSnapshotted(currentPip, _blockTimestamp());
    }

    function _getCurrentPip() internal view virtual returns (uint128) {}
}
