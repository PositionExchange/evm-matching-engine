/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

library Math {
    // _feeCalculator calculate fee
    function feeCalculator(
        uint256 _amount,
        uint16 _fee,
        uint128 _feeBasis
    ) internal view returns (uint256 feeCalculatedAmount) {
        if (_fee == 0) {
            return 0;
        }
        feeCalculatedAmount = (_fee * _amount) / _feeBasis;
    }

    function feeRefundCalculator(
        uint256 _amount,
        uint16 _fee,
        uint128 _feeBasis
    ) internal view returns (uint256 feeRefund) {
        feeRefund = (_amount * _fee) / (_feeBasis - _fee);
    }
}
