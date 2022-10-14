/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "../libraries/helper/LiquidityMath.sol";
import "../libraries/helper/Math.sol";

contract LiquidityMathTest {
    using Math for uint128;

    uint128 public CURVE_PIP = 10**36;

    function calculateBaseWithPriceWhenSell(
        uint128 pipTarget,
        uint128 quoteReal,
        uint128 currentPip
    ) internal view returns (uint128) {
        uint128 sqrtPriceTarget = (pipTarget * CURVE_PIP).sqrt128();
        uint128 sqrtCurrentPrice = (currentPip * CURVE_PIP).sqrt128();
        return
            LiquidityMath.calculateBaseWithPriceWhenSell(
                sqrtPriceTarget,
                quoteReal,
                sqrtCurrentPrice
            );
    }
}
