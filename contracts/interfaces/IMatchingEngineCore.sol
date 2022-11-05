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
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    function updatePartialFilledOrder(uint128 _pip, uint64 _orderId) external;

    function cancelLimitOrder(uint128 _pip, uint64 _orderId)
        external
        returns (uint256 remainingSize, uint256 partialFilled);

    function openLimit(
        uint128 pip,
        uint128 baseAmountIn,
        bool isBuy,
        address trader,
        uint256 quoteAmountIn,
        uint16 feePercent
    )
        external
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled,
            uint256 fee
        );

    function openMarket(
        uint256 size,
        bool isBuy,
        address trader,
        uint16 feePercent
    ) external returns (uint256 baseOut, uint256 quoteOut, uint256 fee);

    function openMarketWithQuoteAsset(
        uint256 quoteAmount,
        bool _isBuy,
        address _trader,
        uint16 feePercent
    ) external returns (uint256 sizeOutQuote, uint256 baseAmount, uint256 fee);

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

    function getAmountEstimate(
        uint256 size,
        bool isBuy,
        bool isBase
    ) external view returns (uint256 mainSideOut, uint256 flipSideOut);

    function calculatingQuoteAmount(uint256 quantity, uint128 pip)
        external
        view
        returns (uint256);

    function getBasisPoint() external view returns (uint256);

    function getCurrentPip() external view returns (uint128);

    function quoteToBase(uint256 quoteAmount, uint128 pip)
        external
        view
        returns (uint256);
}
