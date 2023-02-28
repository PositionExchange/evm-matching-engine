// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

interface IGetFeeShareAMM {
    /// @notice fee share for liquidity provider
    /// @return the rate share
    function feeShareAmm() external view returns (uint32);

    /// @notice fee share for liquidity provider
    /// @param pairManager the address of pair want to know the pai
    /// @return the rate share
    function feeShareAmmWithPair(
        address pairManager
    ) external view returns (uint32);
}
