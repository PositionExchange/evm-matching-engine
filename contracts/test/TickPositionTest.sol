pragma solidity ^0.8.0;

import "../libraries/exchange/TickPosition.sol";

contract TickPositionTest {
    mapping(uint128 => TickPosition.Data) public tickPosition;
}
