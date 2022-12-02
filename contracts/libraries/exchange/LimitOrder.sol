// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library LimitOrder {
    struct Data {
        // Type order LONG or SHORT
        uint8 isBuy;
        uint120 size;
        // NOTICE need to add leverage
        uint120 partialFilled;
    }

    /// @notice get data or order in queue
    /// @return isBuy the side of order
    /// @return size the size of order
    /// @return partialFilled the partial filled of order
    function getData(LimitOrder.Data storage self)
        internal
        view
        returns (
            bool isBuy,
            uint256 size,
            uint256 partialFilled
        )
    {
        isBuy = self.isBuy == 1;
        size = uint256(self.size);
        partialFilled = uint256(self.partialFilled);
    }

    /// @notice update the order when pill
    /// @param isBuy the side of order
    /// @param size the size of order
    function update(
        LimitOrder.Data storage self,
        bool isBuy,
        uint256 size
    ) internal {
        self.isBuy = isBuy ? 1 : 2;
        self.size = uint120(size);
    }

    /// @notice update the order when to partial pill
    /// @param _remainSize remain size of order
    function updatePartialFill(
        LimitOrder.Data storage _self,
        uint120 _remainSize
    ) internal {
        // remainingSize should be negative
        _self.partialFilled += (_self.size - _self.partialFilled - _remainSize);
    }

    /// @notice reset the order to empty when cancel order
    /// @return the remain size of order
    function updateWhenClose(LimitOrder.Data storage self)
        internal
        returns (uint256)
    {
        self.size -= self.partialFilled;
        self.partialFilled = 0;
        return (uint256(self.size));
    }
}
