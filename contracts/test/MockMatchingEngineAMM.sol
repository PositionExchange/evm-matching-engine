/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../MatchingEngineAMM.sol";

contract MockMatchingEngineAMM is MatchingEngineAMM {
    function initialize(InitParams memory params) external virtual override {
        Require._require(!isInitialized, Errors.ME_INITIALIZED);
        isInitialized = true;

        counterParties[params.positionLiquidity] = true;
        counterParties[params.spotHouse] = true;
        counterParties[params.router] = true;

        _initializeAMM(params.pipRange, params.tickSpace, params.initialPip);
        _initializeCore(
            params.basisPoint,
            params.maxFindingWordsIndex,
            params.initialPip
        );
        _initFee(params.quoteAsset, params.baseAsset);

        if (params.basisPoint == 100) {
            rangeFindingWordsAmm = 10;
        } else {
            rangeFindingWordsAmm = 150;
        }
        _approveCounterParty(params.quoteAsset, params.positionLiquidity);
        _approveCounterParty(params.baseAsset, params.positionLiquidity);

        _approveCounterParty(params.quoteAsset, params.spotHouse);
        _approveCounterParty(params.baseAsset, params.spotHouse);

        _approveCounterParty(params.baseAsset, params.router);
        _approveCounterParty(params.quoteAsset, params.router);
    }

    function setCurrentPip(uint128 currentPip) public {
        singleSlot.pip = currentPip;
        currentIndexedPipRange = LiquidityMath.calculateIndexPipRange(
            currentPip,
            pipRange
        );
    }

    function setCounterParty() public {
        counterParties[msg.sender] = true;
    }

    function feeShareAmm() public view override returns (uint32) {
        return 0;
    }
}
