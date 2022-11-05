// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../helper/Liquidity.sol";
import "../../interfaces/IAutoMarketMakerCore.sol";

abstract contract AMMCoreStorage is IAutoMarketMakerCore {
    uint128 public override pipRange;

    uint32 public override tickSpace;

    uint256 public override currentIndexedPipRange;

    mapping(uint256 => Liquidity.Info) public override liquidityInfo;

    uint32 public override feeShareAmm;
}
