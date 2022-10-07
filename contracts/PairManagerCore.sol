/**
 * @author Musket
 */
pragma solidity ^0.8.9;
import "./libraries/exchange/TickPosition.sol";
import "./libraries/exchange/LimitOrder.sol";
import "./libraries/types/PairManagerStorage.sol";
import "./libraries/helper/Timers.sol";
import "./interfaces/IPairManager.sol";


abstract contract PairManagerCore is IPairManager, PairManagerStorage {
    // Define using library
    using TickPosition for TickPosition.Data;
    using LiquidityBitmap for mapping(uint128 => uint256);



    //*
    //*** Virtual functions
    //*

    function updatePartialFilledOrder(uint128 _pip, uint64 _orderId)
        external
        virtual
    {
        uint256 newSize = tickPosition[_pip].updateOrderWhenClose(_orderId);
        _emitLimitOrderUpdatedHook( address(this), _orderId, _pip, newSize);
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
        uint256 quoteAmountIn
    )
        external
        virtual
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled
        )
    {
        (orderId, baseAmountFilled, quoteAmountFilled) = _internalOpenLimit(
            ParamsInternalOpenLimit({
                pip: pip,
                size: baseAmountIn,
                isBuy: isBuy,
                trader: trader,
                quoteDeposited: quoteAmountIn
            })
        );
    }

    function openMarket(
        uint256 size,
        bool isBuy,
        address trader
    )
        external
        virtual
        returns (uint256 sizeOut, uint256 quoteAmount)
    {
        return _internalOpenMarketOrder(size, isBuy, 0, trader, true);
    }



    //*
    // Public view functions
    //*
    function hasLiquidity(uint128 _pip) public view override returns (bool) {
        return liquidityBitmap.hasLiquidity(_pip);
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


    function _internalOpenMarketOrder(
        uint256 _size,
        bool _isBuy,
        uint128 _maxPip,
        address _trader,
        bool _isBase
    ) private returns (uint256 sizeOut, uint256 openOtherSide) {
        return (0,0);
    }

    struct ParamsInternalOpenLimit {
        uint128 pip;
        uint128 size;
        bool isBuy;
        address trader;
        uint256 quoteDeposited;
    }
    function _internalOpenLimit(ParamsInternalOpenLimit memory _params)
        private
        returns (
            uint64 orderId,
            uint256 baseAmountFilled,
            uint256 quoteAmountFilled
    ){
        require(_params.size != 0, "VL_INVALID_SIZE");
        SingleSlot memory _singleSlot = singleSlot;
        uint256 underlyingPip = getUnderlyingPriceInPip();
        {
            if (_params.isBuy && _singleSlot.pip != 0) {
                int256 maxPip = int256(underlyingPip) -
                int128(maxWordRangeForLimitOrder * 250);
                if (maxPip > 0) {
                    require(
                        int128(_params.pip) >= maxPip,
                        "VL_MUST_CLOSE_TO_INDEX_PRICE_LONG"
                    );
                } else {
                    require(
                        _params.pip >= 1,
                        "VL_MUST_CLOSE_TO_INDEX_PRICE_LONG"
                    );
                }
            } else {
                require(
                    _params.pip <= (underlyingPip + maxWordRangeForLimitOrder * 250),
                    "VL_MUST_CLOSE_TO_INDEX_PRICE_SHORT"
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
                (baseAmountFilled, quoteAmountFilled) = _openMarketWithMaxPip(
                    _params.size,
                    _params.isBuy,
                     _params.pip,
                        _params.trader
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
                        quoteToBase(
                            _params.quoteDeposited - quoteAmountFilled,
                            _params.pip
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


    function quoteToBase(uint256 quoteAmount, uint128 pip)
        public
        view
        override
        returns (uint256)
    {
        return (quoteAmount * basisPoint) / pip;
    }


    function _openMarketWithMaxPip(
        uint256 size,
        bool isBuy,
        uint128 maxPip,
        address _trader
    ) internal returns (uint256 sizeOut, uint256 quoteAmount) {
        // plus 1 avoid  (singleSlot.pip - maxPip)/250 = 0
        uint128 _maxFindingWordsIndex = ((
        isBuy ? maxPip - singleSlot.pip : singleSlot.pip - maxPip
        ) / 250) + 1;
        return
        _internalOpenMarketOrderWithMaxFindingWord(
            size,
            isBuy,
            maxPip,
            address(0),
            true,
            _maxFindingWordsIndex
        );
    }

    function _internalOpenMarketOrderWithMaxFindingWord(
        uint256 _size,
        bool _isBuy,
        uint128 _maxPip,
        address _trader,
        bool _isBase,
        uint128 _maxFindingWordsIndex
    ) internal returns (uint256 sizeOut, uint256 openOtherSide) {
        return (0,0);
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


    function getUnderlyingPriceInPip() internal view virtual returns (uint256) {}



}
