// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../exchange/TickPosition.sol";
import "../exchange/LiquidityBitmap.sol";
import "../helper/Timers.sol";

abstract contract MatchingEngineCoreStorage {
    using TickPosition for TickPosition.Data;
    using LiquidityBitmap for mapping(uint128 => uint256);

    // the smallest number of the price. Eg. 100 for 0.01
    uint256 public basisPoint;

    //    // demoninator of the basis point. Eg. 10000 for 0.01
    //    uint256 public BASE_BASIC_POINT;

    // Max finding word can be 3500
    uint128 public maxFindingWordsIndex;

    uint128 public maxWordRangeForLimitOrder;

    uint128 public maxWordRangeForMarketOrder;

    // The unit of measurement to express the change in value between two currencies
    struct SingleSlot {
        uint128 pip;
        //0: not set
        //1: buy
        //2: sell
        uint8 isFullBuy;
    }

    struct LiquidityOfEachPip {
        uint128 pip;
        uint256 liquidity;
    }

    struct StepComputations {
        uint128 pipNext;
    }

    struct ReserveSnapshot {
        uint128 pip;
        uint64 timestamp;
        uint64 blockNumber;
    }

    ReserveSnapshot[] public reserveSnapshots;

    SingleSlot public singleSlot;
    mapping(uint128 => TickPosition.Data) public tickPosition;
    mapping(uint128 => uint256) public tickStore;
    // a packed array of bit, where liquidity is filled or not
    mapping(uint128 => uint256) public liquidityBitmap;
}
