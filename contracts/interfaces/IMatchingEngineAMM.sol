/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./IAutoMarketMakerCore.sol";
import "./IMatchingEngineCore.sol";

interface IMatchingEngineAMM is IAutoMarketMakerCore, IMatchingEngineCore {
    // TODO add guard

    struct ExchangedData {
        uint256 baseAmount;
        uint256 quoteAmount;
        uint256 feeQuoteAmount;
        uint256 feeBaseAmount;
    }

    //
    //    function decreaseBaseFeeFunding(uint256 baseFee) external;
    //
    //    function decreaseQuoteFeeFunding(uint256 quoteFee) external;
    //
    //    function increaseBaseFeeFunding(uint256 baseFee) external;
    //
    //    function increaseQuoteFeeFunding(uint256 quoteFee) external;
    //
    //    function resetFee(uint256 baseFee, uint256 quoteFee) external;

    function accumulateClaimableAmount(
        uint128 _pip,
        uint64 _orderId,
        ExchangedData memory exData,
        uint256 basisPoint,
        uint16 fee,
        uint128 feeBasis
    ) external view returns (ExchangedData memory);
}
