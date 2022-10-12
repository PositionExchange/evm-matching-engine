/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implement/MatchingEngineCore.sol";
import "./implement/AutoMarketMakerCore.sol";
import "./interfaces/IMatchingEngineAMM.sol";

contract MatchingEngineAMM is
    IMatchingEngineAMM,
    AutoMarketMakerCore,
    MatchingEngineCore
{
    using Math for uint128;
    bool isInitialized;
    address public counterParty;
    // quote asset token address
    IERC20 internal quoteAsset;

    // base asset token address
    IERC20 internal baseAsset;

    // base fee for base asset
    uint256 internal baseFeeFunding;

    // base fee for quote asset
    uint256 internal quoteFeeFunding;

    modifier onlyCounterParty() {
        require(counterParty == _msgSender(), "VL_ONLY_COUNTERPARTY");
        _;
    }

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
    ) internal override returns (CrossPipResult memory crossPipResult) {
        (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint8 pipRangeLiquidityIndex,
            uint128 toPip
        ) = _onCrossPipAMM(pipNext, isBuy, isBase, amount);

        return
            CrossPipResult(
                baseCrossPipOut,
                quoteCrossPipOut,
                pipRangeLiquidityIndex,
                toPip
            );
    }

    function getUnderlyingPriceInPip()
        internal
        view
        override
        returns (uint256)
    {
        return uint256(singleSlot.pip);
    }

    function accumulateClaimableAmount(
        uint128 _pip,
        uint64 _orderId,
        ExchangedData memory exData,
        uint256 basisPoint,
        uint16 fee,
        uint128 feeBasis
    ) external view override returns (ExchangedData memory) {
        (
            bool isFilled,
            bool isBuy,
            uint256 baseSize,
            uint256 partialFilled
        ) = getPendingOrderDetail(_pip, _orderId);
        uint256 filledSize = isFilled ? baseSize : partialFilled;
        {
            if (isBuy) {
                //BUY => can claim base asset
                exData.baseAmount += filledSize;
                //                );
            } else {
                // SELL => can claim quote asset
                exData.quoteAmount += TradeConvert.baseToQuote(
                    filledSize,
                    _pip,
                    basisPoint
                );
            }
        }
        return exData;
    }

    function decreaseBaseFeeFunding(uint256 baseFee)
        external
        override
        onlyCounterParty
    {
        if (baseFee > 0) {
            baseFeeFunding -= baseFee;
        }
    }

    function decreaseQuoteFeeFunding(uint256 quoteFee)
        external
        override
        onlyCounterParty
    {
        if (quoteFee > 0) {
            quoteFeeFunding -= quoteFee;
        }
    }

    function increaseBaseFeeFunding(uint256 baseFee)
        external
        override
        onlyCounterParty
    {
        if (baseFee > 0) {
            baseFeeFunding += baseFee;
        }
    }

    function increaseQuoteFeeFunding(uint256 quoteFee)
        external
        override
        onlyCounterParty
    {
        if (quoteFee > 0) {
            quoteFeeFunding += quoteFee;
        }
    }

    function resetFee(uint256 baseFee, uint256 quoteFee)
        external
        override
        onlyCounterParty
    {
        baseFeeFunding -= baseFee;
        quoteFeeFunding -= quoteFee;
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}
