/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../libraries/types/MatchingEngineCoreStorage.sol";

interface IMatchingEngineCore {
    // TODO add guard

    event MarketFilled(
        bool isBuy,
        uint256 indexed amount,
        uint128 toPip,
        uint256 startPip,
        uint128 remainingLiquidity,
        uint64 filledIndex
    );
    event LimitOrderCreated(
        uint64 orderId,
        uint128 pip,
        uint128 size,
        bool isBuy
    );

    event PairManagerInitialized(
        address quoteAsset,
        address baseAsset,
        address counterParty,
        uint256 basisPoint,
        uint256 BASE_BASIC_POINT,
        uint128 maxFindingWordsIndex,
        uint128 initialPip,
        uint64 expireTime,
        address owner
    );
    event LimitOrderCancelled(
        bool isBuy,
        uint64 orderId,
        uint128 pip,
        uint256 size
    );

    event UpdateMaxFindingWordsIndex(
        address spotManager,
        uint128 newMaxFindingWordsIndex
    );

    event MaxWordRangeForLimitOrderUpdated(
        uint128 newMaxWordRangeForLimitOrder
    );
    event MaxWordRangeForMarketOrderUpdated(
        uint128 newMaxWordRangeForMarketOrder
    );
    event UpdateBasisPoint(address spotManager, uint256 newBasicPoint);
    event UpdateBaseBasicPoint(address spotManager, uint256 newBaseBasisPoint);
    event ReserveSnapshotted(uint128 pip, uint256 timestamp);
    event LimitOrderUpdated(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    );
    event UpdateExpireTime(address spotManager, uint64 newExpireTime);
    event UpdateCounterParty(address spotManager, address newCounterParty);
    event LiquidityPoolAllowanceUpdate(address liquidityPool, bool value);

    function updatePartialFilledOrder(uint128 _pip, uint64 _orderId) external;

    function cancelLimitOrder(uint128 _pip, uint64 _orderId)
        external
        returns (uint256 remainingSize, uint256 partialFilled);

    function openLimit(
        uint128 pip,
        uint128 baseAmountIn,
        bool isBuy,
        address trader,
        uint256 quoteAmountIn
    )
        external
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled
        );

    function openMarket(
        uint256 size,
        bool isBuy,
        address trader
    ) external returns (uint256 baseOut, uint256 quoteOut);

    function openMarketWithQuoteAsset(
        uint256 quoteAmount,
        bool _isBuy,
        address _trader
    ) external returns (uint256 sizeOutQuote, uint256 baseAmount);

    function hasLiquidity(uint128 _pip) external view returns (bool);

    function getPendingOrderDetail(uint128 pip, uint64 orderId)
        external
        view
        returns (
            bool isFilled,
            bool isBuy,
            uint256 size,
            uint256 partialFilled
        );

    function getLiquidityInCurrentPip() external view returns (uint128);

    function getLiquidityInPipRange(
        uint128 fromPip,
        uint256 dataLength,
        bool toHigher
    )
        external
        view
        virtual
        returns (
            MatchingEngineCoreStorage.LiquidityOfEachPip[] memory,
            uint128
        );
}