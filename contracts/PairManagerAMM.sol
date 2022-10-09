pragma solidity ^0.8.0;

import "./implement/PairManagerCore.sol";
import "./implement/AutoMarketMakerCore.sol";

contract PairManagerAMM is AutoMarketMakerCore, PairManagerCore {
    bool isInitialized;

    function initialize() external {
        require(!isInitialized, "Initialized");
        isInitialized = true;
    }

    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal override {}

//    function _onCrossPipHook(uint128 pipNext)
//        internal
//        view
//        override(PairManagerCore)
//        returns (
//            uint256 _hookBaseOut,
//            uint256 _hookQuoteOut,
//            uint256 _pipRangeLiquidityIndex
//        )
//    {
//        return (0, 0, 0);
//    }

    function getUnderlyingPriceInPip()
        internal
        view
        override
        returns (uint256)
    {
        return 0;
    }
}
