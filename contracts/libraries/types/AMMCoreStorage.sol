pragma solidity ^0.8.0;

abstract contract AMMCoreStorage {
    uint256 pipRange;

    uint256 liquidity;

    uint32 tickSpace;

    struct RealReserve {
        uint256 baseReal;
        uint256 quoteReal;
    }

    struct PipRangeInfo {
        uint128 sqrtMaxPip;
        uint128 sqrtMinPip;
        uint256 quoteVirtual;
        uint256 baseVirtual;
        uint32 indexedPipRanger;
        uint128 feeGrowthBase;
        uint128 feeGrowthQuote;
    }

    mapping(uint128 => PipRangeInfo) public pipRangeInfo;
}
