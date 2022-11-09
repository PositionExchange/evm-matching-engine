/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "../libraries/exchange/LimitOrder.sol";
import "../libraries/types/MatchingEngineCoreStorage.sol";
import "../libraries/helper/Timers.sol";
import "../libraries/helper/TradeConvert.sol";
import "../libraries/exchange/TickPosition.sol";
import "./Block.sol";
import "../libraries/helper/Convert.sol";
import "../interfaces/IMatchingEngineCore.sol";
import "../libraries/exchange/SwapState.sol";
import "../libraries/amm/CrossPipResult.sol";
import "hardhat/console.sol";

abstract contract MatchingEngineCore is
    Block,
    MatchingEngineCoreStorage
{
    // Define using library
    using TickPosition for TickPosition.Data;
    using LiquidityBitmap for mapping(uint128 => uint256);
    using Convert for uint256;
    using Convert for int256;
    using SwapState for SwapState.State;

    function _initializeCore(
        uint256 _basisPoint,
        uint256 _baseBasisPoint,
        uint128 _maxFindingWordsIndex,
        uint128 _initialPip
    ) internal {
        reserveSnapshots.push(
            ReserveSnapshot(_initialPip, _blockTimestamp(), _blockNumber())
        );
        singleSlot.pip = _initialPip;
        basisPoint = _basisPoint;
        maxFindingWordsIndex = _maxFindingWordsIndex;
        maxWordRangeForLimitOrder = _maxFindingWordsIndex;
        maxWordRangeForMarketOrder = _maxFindingWordsIndex;
    }

    //*
    //*** Virtual functions
    //*

    function updatePartialFilledOrder(uint128 _pip, uint64 _orderId)
        external
        virtual
    {
        uint256 newSize = tickPosition[_pip].updateOrderWhenClose(_orderId);
        _emitLimitOrderUpdatedHook(address(this), _orderId, _pip, newSize);
    }

    function cancelLimitOrder(uint128 _pip, uint64 _orderId)
        external
        virtual
        returns (uint256 remainingSize, uint256 partialFilled)
    {
        TickPosition.Data storage _tickPosition = tickPosition[_pip];
        require(
            hasLiquidity(_pip) && _orderId >= _tickPosition.filledIndex,
            "VL_ONLY_PENDING_ORDER"
        );
        return _internalCancelLimitOrder(_tickPosition, _pip, _orderId);
    }

    function openLimit(
        uint128 pip,
        uint128 baseAmountIn,
        bool isBuy,
        address trader,
        uint256 quoteAmountIn,
        uint16 feePercent
    )
        external
        virtual
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled,
            uint256 fee
        )
    {
        (
            orderId,
            baseAmountFilled,
            quoteAmountFilled,
            fee
        ) = _internalOpenLimit(
            ParamsInternalOpenLimit({
                pip: pip,
                size: baseAmountIn,
                isBuy: isBuy,
                trader: trader,
                quoteDeposited: quoteAmountIn,
                feePercent: feePercent
            })
        );
    }

    function openMarket(
        uint256 size,
        bool isBuy,
        address trader,
        uint16 feePercent
    )
        external
        virtual
        returns (
            uint256 baseOut,
            uint256 quoteOut,
            uint256 fee
        )
    {
        return
            _internalOpenMarketOrder(
                size,
                isBuy,
                0,
                trader,
                true,
                maxWordRangeForLimitOrder,
                feePercent
            );
    }

    function openMarketWithQuoteAsset(
        uint256 quoteAmount,
        bool _isBuy,
        address _trader,
        uint16 feePercent
    )
        external
        virtual
        returns (
            uint256 sizeOutQuote,
            uint256 baseAmount,
            uint256 fee
        )
    {
        (sizeOutQuote, baseAmount, fee) = _internalOpenMarketOrder(
            quoteAmount,
            _isBuy,
            0,
            _trader,
            false,
            maxWordRangeForLimitOrder,
            feePercent
        );
    }

    //*
    // Public view functions
    //*
    function hasLiquidity(uint128 _pip) public view returns (bool) {
        return liquidityBitmap.hasLiquidity(_pip);
    }

    function getPendingOrderDetail(uint128 pip, uint64 orderId)
        public
        view
        virtual
        returns (
            bool isFilled,
            bool isBuy,
            uint256 size,
            uint256 partialFilled
        )
    {
        (isFilled, isBuy, size, partialFilled) = tickPosition[pip]
            .getQueueOrder(orderId);

        if (!liquidityBitmap.hasLiquidity(pip)) {
            isFilled = true;
        }
        if (size != 0 && size == partialFilled) {
            isFilled = true;
        }
    }

    function getLiquidityInCurrentPip() public view returns (uint128) {
        return
            liquidityBitmap.hasLiquidity(singleSlot.pip)
                ? tickPosition[singleSlot.pip].liquidity
                : 0;
    }

    //*
    // Private functions
    //*

    function _internalCancelLimitOrder(
        TickPosition.Data storage _tickPosition,
        uint128 _pip,
        uint64 _orderId
    ) private returns (uint256 remainingSize, uint256 partialFilled) {
        bool isBuy;
        (remainingSize, partialFilled, isBuy) = _tickPosition.cancelLimitOrder(
            _orderId
        );
        // if that pip doesn't have liquidity after closed order, toggle pip to uninitialized
        if (_tickPosition.liquidity == 0) {
            liquidityBitmap.toggleSingleBit(_pip, false);
            // only unset isFullBuy when cancel order pip == current pip
            if (_pip == singleSlot.pip) {
                singleSlot.isFullBuy = 0;
            }
        }
        emit LimitOrderCancelled(isBuy, _orderId, _pip, remainingSize);
    }

    struct ParamsInternalOpenLimit {
        uint128 pip;
        uint128 size;
        bool isBuy;
        address trader;
        uint256 quoteDeposited;
        uint16 feePercent;
    }

    function _internalOpenLimit(ParamsInternalOpenLimit memory _params)
        private
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled,
            uint256 fee
        )
    {
        require(_params.size != 0, "6");
        SingleSlot memory _singleSlot = singleSlot;
        uint256 underlyingPip = uint256(getUnderlyingPriceInPip());
        {
            if (_params.isBuy && _singleSlot.pip != 0) {
                int256 maxPip = int256(underlyingPip) -
                    int128(maxWordRangeForLimitOrder * 250);

                if (maxPip > 0) {
                    require(int128(_params.pip) >= maxPip, "24.2");
                } else {
                    require(_params.pip >= 1, "24.2");
                }
            } else {
                require(
                    _params.pip <=
                        (underlyingPip + maxWordRangeForLimitOrder * 250),
                    "4"
                );
            }
        }
        bool hasLiquidity = liquidityBitmap.hasLiquidity(_params.pip);
        //save gas
        {
            bool canOpenMarketWithMaxPip = (_params.isBuy &&
                _params.pip >= _singleSlot.pip) ||
                (!_params.isBuy && _params.pip <= _singleSlot.pip);
            if (canOpenMarketWithMaxPip) {
                // open market
                if (_params.isBuy) {
                    // higher pip when long must lower than max word range for market order short
                    require(
                        _params.pip <=
                            underlyingPip + maxWordRangeForMarketOrder * 250,
                        "VL_MARKET_ORDER_MUST_CLOSE_TO_INDEX_PRICE"
                    );
                } else {
                    // lower pip when short must higher than max word range for market order long
                    require(
                        int128(_params.pip) >=
                            (int256(underlyingPip) -
                                int128(maxWordRangeForMarketOrder * 250)),
                        "VL_MARKET_ORDER_MUST_CLOSE_TO_INDEX_PRICE"
                    );
                }
                (
                    baseAmountFilled,
                    quoteAmountFilled,
                    fee
                ) = _openMarketWithMaxPip(
                    _params.size,
                    _params.isBuy,
                    _params.pip,
                    _params.trader,
                    _params.feePercent
                );
                hasLiquidity = liquidityBitmap.hasLiquidity(_params.pip);
                // reassign _singleSlot after _openMarketPositionWithMaxPip
                _singleSlot = singleSlot;
            }
        }
        {
            if (
                (_params.size > baseAmountFilled) ||
                (_params.size == baseAmountFilled &&
                    _params.quoteDeposited > quoteAmountFilled &&
                    _params.quoteDeposited > 0)
            ) {
                uint128 remainingSize;

                if (
                    _params.quoteDeposited > 0 &&
                    _params.isBuy &&
                    _params.quoteDeposited > quoteAmountFilled
                ) {
                    remainingSize = uint128(
                        TradeConvert.quoteToBase(
                            _params.quoteDeposited - quoteAmountFilled,
                            _params.pip,
                            _singleSlot.pip
                        )
                    );
                } else {
                    remainingSize = _params.size - uint128(baseAmountFilled);
                }

                if (
                    _params.pip == _singleSlot.pip &&
                    _singleSlot.isFullBuy != (_params.isBuy ? 1 : 2)
                ) {
                    singleSlot.isFullBuy = _params.isBuy ? 1 : 2;
                }

                orderId = tickPosition[_params.pip].insertLimitOrder(
                    remainingSize,
                    hasLiquidity,
                    _params.isBuy
                );
                if (!hasLiquidity) {
                    //set the bit to mark it has liquidity
                    liquidityBitmap.toggleSingleBit(_params.pip, true);
                }
                emit LimitOrderCreated(
                    orderId,
                    _params.pip,
                    remainingSize,
                    _params.isBuy
                );
            }
        }
    }

    function _openMarketWithMaxPip(
        uint256 size,
        bool isBuy,
        uint128 maxPip,
        address _trader,
        uint16 feePercent
    )
        internal
        returns (
            uint256 baseOut,
            uint256 quoteOut,
            uint256 fee
        )
    {
        // plus 1 avoid  (singleSlot.pip - maxPip)/250 = 0
        uint128 _maxFindingWordsIndex = ((
            isBuy ? maxPip - singleSlot.pip : singleSlot.pip - maxPip
        ) / 250) + 1;
        return
            _internalOpenMarketOrder(
                size,
                isBuy,
                maxPip,
                address(0),
                true,
                _maxFindingWordsIndex,
                feePercent
            );
    }

    function _internalOpenMarketOrder(
        uint256 _size,
        bool _isBuy,
        uint128 _maxPip,
        address _trader,
        bool _isBase,
        uint128 _maxFindingWordsIndex,
        uint16 feePercent
    )
        internal
        virtual
        returns (
            uint256 mainSideOut,
            uint256 flipSideOut,
            uint256 fee
        )
    {
        // get current tick liquidity
        SingleSlot memory _initialSingleSlot = singleSlot;

        //save gas
        SwapState.State memory state = SwapState.State({
            remainingSize: _size,
            pip: _initialSingleSlot.pip,
            basisPoint: basisPoint.Uint256ToUint32(),
            startPip: 0,
            remainingLiquidity: 0,
            isFullBuy: _initialSingleSlot.isFullBuy,
            isSkipFirstPip: false,
            lastMatchedPip: _initialSingleSlot.pip,
            isBuy: _isBuy,
            isBase: _isBase,
            flipSideOut: 0,
            ammState: SwapState.newAMMState()
        });
        state.beforeExecute();

        while (state.remainingSize != 0) {
            StepComputations memory step;
            uint256 startGas = gasleft();
            (step.pipNext) = liquidityBitmap.findHasLiquidityInMultipleWords(
                state.pip,
                _maxFindingWordsIndex,
                !state.isBuy
            );

            console.log(
                "[MatchingEngineCore][_internalOpenMarketOrder] gasUsed find liquidity, state.pip, step.pipNext: ",
                startGas - gasleft(),
                state.pip,
                step.pipNext
            );

            // updated findHasLiquidityInMultipleWords, save more gas
            if (_maxPip != 0) {
                // if order is buy and step.pipNext (pip has liquidity) > maxPip then break cause this is limited to maxPip and vice versa
                if (state.isReachedMaxPip(step.pipNext, _maxPip)) {
                    break;
                }
            }

            startGas = gasleft();

            CrossPipResult.Result memory crossPipResult = _onCrossPipHook(
                step.pipNext,
                state.isBuy,
                _isBase,
                uint128(state.remainingSize),
                state.basisPoint,
                state.pip,
                state.ammState
            );
            console.log(
                "[MatchingEngineCore][_internalOpenMarketOrder] gasUsed _onCrossPipHook: ",
                startGas - gasleft()
            );

            if (
                state.ammState.index >= 5 ||
                state.ammState.lastPipRangeLiquidityIndex == -2
            ) {
                break;
            }
            if (crossPipResult.baseCrossPipOut > 0 && step.pipNext == 0) {
                step.pipNext = crossPipResult.toPip;
            }
            /// In this line, step.pipNext still is 0, that means no liquidity for this order

            if (step.pipNext == 0) {
                // no more next pip
                // state pip back 1 pip
                state.moveBack1Pip();
                break;
            } else {
                if (
                    crossPipResult.baseCrossPipOut > 0 &&
                    crossPipResult.quoteCrossPipOut > 0
                ) {
                    if (crossPipResult.baseCrossPipOut >= state.remainingSize) {
                        // TODO verify me
                        if (
                            (state.isBuy && crossPipResult.toPip > state.pip) ||
                            (!state.isBuy && crossPipResult.toPip < state.pip)
                        ) {
                            state.pip = crossPipResult.toPip;
                        }
                        state.ammFillAll(
                            crossPipResult.baseCrossPipOut,
                            crossPipResult.quoteCrossPipOut
                        );
                        break;
                    } else {
                        state.updateAMMTradedSize(
                            crossPipResult.baseCrossPipOut,
                            crossPipResult.quoteCrossPipOut
                        );
                        state.isSkipFirstPip = false;
                    }
                }

                if (!state.isSkipFirstPip) {
                    if (state.startPip == 0) state.startPip = step.pipNext;

                    // get liquidity at a tick index
                    uint128 liquidity = tickPosition[step.pipNext].liquidity;
                    if (_maxPip != 0) {
                        state.lastMatchedPip = step.pipNext;
                    }
                    uint256 remainingQuantity = state.isBase
                        ? state.remainingSize
                        : TradeConvert.quoteToBase(
                            state.remainingSize,
                            step.pipNext,
                            state.basisPoint
                        );
                    if (liquidity > remainingQuantity) {
                        // pip position will partially filled and stop here
                        tickPosition[step.pipNext].partiallyFill(
                            remainingQuantity.Uint256ToUint128()
                        );
                        state.updateTradedSize(
                            state.remainingSize,
                            step.pipNext
                        );
                        // remaining liquidity at current pip
                        state.remainingLiquidity =
                            liquidity -
                            remainingQuantity.Uint256ToUint128();
                        state.pip = step.pipNext;
                        state.reverseIsFullBuy();
                    } else if (remainingQuantity > liquidity) {
                        // order in that pip will be fulfilled
                        state.updateTradedSize(liquidity, step.pipNext);
                        state.moveForward1Pip(step.pipNext);
                    } else {
                        // remaining size = liquidity
                        // only 1 pip should be toggled, so we call it directly here
                        liquidityBitmap.toggleSingleBit(step.pipNext, false);
                        state.updateTradedSize(liquidity, step.pipNext);
                        state.pip = step.pipNext;
                        state.isFullBuy = 0;
                    }
                } else {
                    state.isSkipFirstPip = false;
                    state.moveForward1Pip(step.pipNext);
                }
            }
        }

        {
            if (
                _initialSingleSlot.pip != state.pip &&
                state.remainingSize != _size
            ) {
                // all ticks in shifted range must be marked as filled
                if (
                    !(state.remainingLiquidity > 0 &&
                        state.startPip == state.pip) && state.startPip != 0
                ) {
                    if (_maxPip != 0) {
                        state.pip = state.lastMatchedPip;
                    }

                    liquidityBitmap.unsetBitsRange(
                        state.startPip,
                        state.remainingLiquidity > 0
                            ? (state.isBuy ? state.pip - 1 : state.pip + 1)
                            : state.pip
                    );
                }
                // TODO write a checkpoint that we shift a range of ticks
            } else if (
                _maxPip != 0 &&
                _initialSingleSlot.pip == state.pip &&
                state.remainingSize < _size &&
                state.remainingSize != 0
            ) {
                // if limit order with max pip filled current pip, toggle current pip to initialized
                // after that when create new limit order will initialize pip again in `OpenLimitPosition`
                liquidityBitmap.toggleSingleBit(state.pip, false);
            }

            if (state.remainingSize != _size) {
                // if limit order with max pip filled other order, update isFullBuy
                singleSlot.isFullBuy = state.isFullBuy;
            }
            if (_maxPip != 0) {
                // if limit order still have remainingSize, change current price to limit price
                // else change current price to last matched pip
                singleSlot.pip = state.remainingSize != 0
                    ? _maxPip
                    : state.lastMatchedPip;
            } else {
                singleSlot.pip = state.pip;
            }
        }

        mainSideOut = _size - state.remainingSize;
        flipSideOut = state.flipSideOut;
        _addReserveSnapshot();

        fee = _calculateFee(
            state.ammState,
            singleSlot.pip,
            state.isBuy,
            state.isBase,
            mainSideOut,
            flipSideOut,
            feePercent
        );

        if (mainSideOut != 0) {
            emit MarketFilled(
                state.isBuy,
                _isBase ? mainSideOut : flipSideOut,
                singleSlot.pip,
                state.startPip,
                state.remainingLiquidity,
                tickPosition[singleSlot.pip].calculatingFilledIndex()
            );
            emitEventSwap(state.isBuy, mainSideOut, flipSideOut, _trader);
        }
    }

    //*
    // HOOK HERE *
    //*
    function _emitLimitOrderUpdatedHook(
        address spotManager,
        uint64 orderId,
        uint128 pip,
        uint256 size
    ) internal virtual {}

    function _onCrossPipHook(
        uint128 pipNext,
        bool isBuy,
        bool isBase,
        uint128 amount,
        uint32 basisPoint,
        uint128 currentPip,
        SwapState.AmmState memory ammState
    ) internal virtual returns (CrossPipResult.Result memory crossPipResult) {}

    function _updateAMMState(
        SwapState.AmmState memory ammState,
        uint128 currentPip,
        bool isBuy,
        uint16 feePercent
    )
        internal
        virtual
        returns (
            uint128 totalFeeAmm,
            uint128 feeProtocolAmm,
            uint128 totalFilledAmm
        )
    {}

    function _calculateFee(
        SwapState.AmmState memory ammState,
        uint128 currentPip,
        bool isBuy,
        bool isBase,
        uint256 mainSideOut,
        uint256 flipSideOut,
        uint16 feePercent
    ) internal virtual returns (uint256) {}

    function emitEventSwap(
        bool isBuy,
        uint256 _baseAmount,
        uint256 _quoteAmount,
        address _trader
    ) internal virtual {}

    function getLiquidityInPipRange(
        uint128 fromPip,
        uint256 dataLength,
        bool toHigher
    ) external view virtual returns (LiquidityOfEachPip[] memory, uint128) {}

    // TODO Must implement this function
    function getAmountEstimate(
        uint256 size,
        bool isBuy,
        bool isBase
    ) external view returns (uint256 mainSideOut, uint256 flipSideOut) {}

    // TODO Must implement this function
    function calculatingQuoteAmount(uint256 quantity, uint128 pip)
        external
        view
        virtual
        returns (uint256)
    {}

    function getBasisPoint() external view virtual returns (uint256) {}

    function getCurrentPip() external view virtual returns (uint128) {}

    function quoteToBase(uint256 quoteAmount, uint128 pip)
        external
        view
        returns (uint256)
    {}

    function getUnderlyingPriceInPip() internal view virtual returns (uint256) {
        return uint256(singleSlot.pip);
    }

    function _addReserveSnapshot() internal virtual {}
}
