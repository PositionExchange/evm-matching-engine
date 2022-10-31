/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library CrossPipResult {
    struct Result {
        uint128 baseCrossPipOut;
        uint128 quoteCrossPipOut;
        uint128 toPip;
    }

    function updateAmountResult(
        Result memory self,
        uint128 baseCrossPipOut,
        uint128 quoteCrossPipOut
    ) internal {
        self.baseCrossPipOut += baseCrossPipOut;
        self.quoteCrossPipOut += quoteCrossPipOut;
    }

    function updatePipResult(Result memory self, uint128 toPip) internal {
        self.toPip = toPip;
    }
}
