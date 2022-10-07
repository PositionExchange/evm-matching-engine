/**
 * @author Musket
 */
pragma solidity ^0.8.0;

import "../PairManager.sol";

import "hardhat/console.sol";

import "../libraries/helper/Convert.sol";
import "../libraries/helper/TradeConvert.sol";

contract MockPairManager is PairManager {
    using TickPosition for TickPosition.Data;
    using LiquidityBitmap for mapping(uint128 => uint256);
    using Timers for uint64;
    using Convert for uint256;
    using Convert for int256;
    using TradeConvert for uint256;

    IPairManager.ExchangedData public exData;
    bool isFilled;

}
