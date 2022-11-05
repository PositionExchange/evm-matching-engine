/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../interfaces/IFee.sol";

abstract contract Fee is IFee {
    // quote asset token address
    IERC20 internal quoteAsset;

    // base asset token address
    IERC20 internal baseAsset;

    // base fee for base asset
    uint256 internal baseFeeFunding;

    // base fee for quote asset
    uint256 internal quoteFeeFunding;

    function _initFee(IERC20 quoteAsset, IERC20 baseAsset) internal pure {
        quoteAsset = quoteAsset;
        baseAsset = baseAsset;
    }

    function decreaseBaseFeeFunding(uint256 baseFee) external virtual {
        if (baseFee > 0) {
            baseFeeFunding -= baseFee;
        }
    }

    function decreaseQuoteFeeFunding(uint256 quoteFee) external virtual {
        if (quoteFee > 0) {
            quoteFeeFunding -= quoteFee;
        }
    }

    function increaseBaseFeeFunding(uint256 baseFee) public virtual {
        if (baseFee > 0) {
            baseFeeFunding += baseFee;
        }
    }

    function increaseQuoteFeeFunding(uint256 quoteFee) public virtual {
        if (quoteFee > 0) {
            quoteFeeFunding += quoteFee;
        }
    }

    function resetFee(uint256 baseFee, uint256 quoteFee) external virtual {
        baseFeeFunding -= baseFee;
        quoteFeeFunding -= quoteFee;
    }

    function getFee()
        external
        view
        returns (uint256 baseFeeFunding, uint256 quoteFeeFunding)
    {
        return (baseFeeFunding, quoteFeeFunding);
    }
}
