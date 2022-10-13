/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implement/MatchingEngineCore.sol";
import "./implement/AutoMarketMakerCore.sol";
import "./interfaces/IMatchingEngineAMM.sol";
import "./libraries/extensions/Fee.sol";

contract MatchingEngineAMM is
    IMatchingEngineAMM,
    Fee,
    AutoMarketMakerCore,
    MatchingEngineCore
{
    using Math for uint128;
    bool isInitialized;
    address public counterParty;

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
    )
        internal
        override(MatchingEngineCore)
        returns (CrossPipResult memory crossPipResult)
    {
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

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function _addReserveSnapshot() internal override(MatchingEngineCore) {}

    function emitEventSwap(
        bool isBuy,
        uint256 _baseAmount,
        uint256 _quoteAmount,
        address _trader
    ) internal override(MatchingEngineCore) {}

    function getLiquidityInPipRange(
        uint128 fromPip,
        uint256 dataLength,
        bool toHigher
    )
        external
        view
        override(MatchingEngineCore, IMatchingEngineCore)
        returns (LiquidityOfEachPip[] memory, uint128)
    {}
}
