// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../helper/Liquidity.sol";

abstract contract AMMCoreStorage {
    uint128 public pipRange;

    uint32 public tickSpace;

    uint32 public currentIndexedPipRange;

    struct RealReserve {
        uint256 baseReal;
        uint256 quoteReal;
    }

    mapping(uint64 => Liquidity.Info) public liquidityInfo;
}
