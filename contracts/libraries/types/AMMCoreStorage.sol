// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../helper/Liquidity.sol";

abstract contract AMMCoreStorage {
    uint128 public pipRange;

    uint32 public tickSpace;

    uint256 public currentIndexedPipRange;

    mapping(uint256 => Liquidity.Info) public liquidityInfo;

    uint32 public feeShareAmm;
}
