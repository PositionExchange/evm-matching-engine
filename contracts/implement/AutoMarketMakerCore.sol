/**
 * @author Musket
 */
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";
import "../libraries/helper/Math.sol";
import "../libraries/helper/LiquidityMath.sol";
import "../interfaces/IAutoMarketMakerCore.sol";
import "../libraries/exchange/SwapState.sol";
import "../libraries/amm/CrossPipResult.sol";
import "../libraries/helper/Convert.sol";
import "../libraries/helper/FixedPoint128.sol";

abstract contract AutoMarketMakerCore is AMMCoreStorage {
    using Liquidity for Liquidity.Info;
    using Math for uint128;
    using Math for uint256;
    using Convert for uint256;
    using CrossPipResult for CrossPipResult.Result;

    function _initializeAMM(
        uint128 _pipRange,
        uint32 _tickSpace,
        uint128 _initPip,
        uint32 _feeShareAmm
    ) internal {
        pipRange = _pipRange;
        tickSpace = _tickSpace;
        feeShareAmm = _feeShareAmm;

        currentIndexedPipRange = LiquidityMath.calculateIndexPipRange(
            _initPip,
            _pipRange
        );
    }

    struct AddLiquidityState {
        uint128 currentPrice;
        uint128 quoteReal;
        uint128 baseReal;
        uint128 cacheSqrtK;
    }

    function addLiquidity(AddLiquidity calldata params)
        public
        virtual
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint256 liquidity,
            uint256 feeGrowthBase,
            uint256 feeGrowthQuote
        )
    {
        _onlyCounterParty();

        AddLiquidityState memory state;
        Liquidity.Info memory _liquidityInfo = liquidityInfo[
            params.indexedPipRange
        ];

        state.currentPrice = _calculateSqrtPrice(
            getCurrentPip(),
            FixedPoint128.BUFFER
        );
        state.cacheSqrtK = _liquidityInfo.sqrtK;

        if (_liquidityInfo.sqrtK == 0) {
            (uint128 pipMin, uint128 pipMax) = LiquidityMath.calculatePipRange(
                params.indexedPipRange,
                pipRange
            );

            _liquidityInfo.sqrtMaxPip = _calculateSqrtPrice(
                pipMax,
                FixedPoint128.BUFFER
            );
            _liquidityInfo.sqrtMinPip = _calculateSqrtPrice(
                pipMin,
                FixedPoint128.BUFFER
            );
            _liquidityInfo.indexedPipRange = params.indexedPipRange;
        }

        if (params.indexedPipRange < currentIndexedPipRange) {
            state.currentPrice = _liquidityInfo.sqrtMaxPip;
        } else if (params.indexedPipRange > currentIndexedPipRange) {
            state.currentPrice = _liquidityInfo.sqrtMinPip;
        }
        state.quoteReal = LiquidityMath.calculateQuoteReal(
            _liquidityInfo.sqrtMinPip,
            params.quoteAmount,
            state.currentPrice
        );
        state.baseReal = LiquidityMath.calculateBaseReal(
            _liquidityInfo.sqrtMaxPip,
            params.baseAmount,
            state.currentPrice
        );

        _liquidityInfo.baseReal += state.baseReal;
        _liquidityInfo.quoteReal += state.quoteReal;

        if (
            (params.indexedPipRange < currentIndexedPipRange) ||
            ((params.indexedPipRange == currentIndexedPipRange) &&
                (state.currentPrice == _liquidityInfo.sqrtMaxPip))
        ) {
            _liquidityInfo.sqrtK = (LiquidityMath.calculateKWithQuote(
                _liquidityInfo.quoteReal,
                state.currentPrice
            ) * _basisPoint()).sqrt().Uint256ToUint128();
            _liquidityInfo.baseReal = uint128(
                (uint256(_liquidityInfo.sqrtK)**2) /
                    uint256(_liquidityInfo.quoteReal)
            );
        } else if (
            (params.indexedPipRange > currentIndexedPipRange) ||
            ((params.indexedPipRange == currentIndexedPipRange) &&
                (state.currentPrice == _liquidityInfo.sqrtMinPip))
        ) {
            _liquidityInfo.sqrtK = (LiquidityMath.calculateKWithBase(
                _liquidityInfo.baseReal,
                state.currentPrice
            ) / _basisPoint()).sqrt().Uint256ToUint128();
            _liquidityInfo.quoteReal = uint128(
                (uint256(_liquidityInfo.sqrtK)**2) /
                    uint256(_liquidityInfo.baseReal)
            );
        } else if (params.indexedPipRange == currentIndexedPipRange) {
            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithBaseAndQuote(
                    _liquidityInfo.baseReal,
                    _liquidityInfo.quoteReal
                )
                .sqrt()
                .Uint256ToUint128();
        }
        liquidityInfo[params.indexedPipRange].updateAddLiquidity(
            _liquidityInfo
        );
        return (
            params.baseAmount,
            params.quoteAmount,
            _liquidityInfo.sqrtK - state.cacheSqrtK,
            _liquidityInfo.feeGrowthBase,
            _liquidityInfo.feeGrowthQuote
        );
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        public
        virtual
        returns (uint128 baseAmount, uint128 quoteAmount)
    {
        _onlyCounterParty();
        Liquidity.Info memory _liquidityInfo;

        (baseAmount, quoteAmount, _liquidityInfo) = estimateRemoveLiquidity(
            params
        );
        liquidityInfo[params.indexedPipRange].updateAddLiquidity(
            _liquidityInfo
        );
    }

    function estimateRemoveLiquidity(RemoveLiquidity calldata params)
        public
        view
        returns (
            uint128 baseAmount,
            uint128 quoteAmount,
            Liquidity.Info memory _liquidityInfo
        )
    {
        _liquidityInfo = liquidityInfo[params.indexedPipRange];
        uint128 quoteRealRemove = LiquidityMath.calculateQuoteRealByLiquidity(
            params.liquidity,
            _liquidityInfo.sqrtK,
            _liquidityInfo.quoteReal
        );
        _liquidityInfo.quoteReal = _liquidityInfo.quoteReal > quoteRealRemove
            ? _liquidityInfo.quoteReal - quoteRealRemove
            : 0;
        uint128 baseRealRemove = LiquidityMath.calculateBaseRealByLiquidity(
            params.liquidity,
            _liquidityInfo.sqrtK,
            _liquidityInfo.baseReal
        );
        _liquidityInfo.baseReal = _liquidityInfo.baseReal > baseRealRemove
            ? _liquidityInfo.baseReal - baseRealRemove
            : 0;

        uint128 sqrtBasicPoint = uint256(_basisPoint())
            .sqrt()
            .Uint256ToUint128();

        uint128 _currentPrice = _calculateSqrtPrice(
            getCurrentPip(),
            FixedPoint128.BUFFER
        );

        if (
            (params.indexedPipRange < currentIndexedPipRange) ||
            (params.indexedPipRange == currentIndexedPipRange &&
                _currentPrice == _liquidityInfo.sqrtMaxPip)
        ) {
            quoteAmount =
                LiquidityMath.calculateQuoteByLiquidity(
                    params.liquidity,
                    _liquidityInfo.sqrtMinPip,
                    _liquidityInfo.sqrtMaxPip
                ) /
                sqrtBasicPoint;

            _liquidityInfo.sqrtK =
                LiquidityMath
                    .calculateKWithQuote(
                        _liquidityInfo.quoteReal,
                        _liquidityInfo.sqrtMaxPip
                    )
                    .sqrt()
                    .Uint256ToUint128() *
                sqrtBasicPoint;
        } else if (
            (params.indexedPipRange > currentIndexedPipRange) ||
            (params.indexedPipRange == currentIndexedPipRange &&
                _currentPrice == _liquidityInfo.sqrtMinPip)
        ) {
            baseAmount =
                LiquidityMath.calculateBaseByLiquidity(
                    params.liquidity,
                    _liquidityInfo.sqrtMaxPip,
                    _liquidityInfo.sqrtMinPip
                ) *
                sqrtBasicPoint;

            _liquidityInfo.sqrtK =
                LiquidityMath
                    .calculateKWithBase(
                        _liquidityInfo.baseReal,
                        _liquidityInfo.sqrtMinPip
                    )
                    .sqrt()
                    .Uint256ToUint128() /
                sqrtBasicPoint;
        } else {
            baseAmount =
                LiquidityMath.calculateBaseByLiquidity(
                    params.liquidity,
                    _liquidityInfo.sqrtMaxPip,
                    _currentPrice
                ) *
                sqrtBasicPoint;
            quoteAmount =
                LiquidityMath.calculateQuoteByLiquidity(
                    params.liquidity,
                    _liquidityInfo.sqrtMinPip,
                    _currentPrice
                ) /
                sqrtBasicPoint;

            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithBaseAndQuote(
                    _liquidityInfo.baseReal,
                    _liquidityInfo.quoteReal
                )
                .sqrt()
                .Uint256ToUint128();
        }
    }

    function getCurrentPip() public view virtual returns (uint128) {}

    struct OnCrossPipParams {
        uint128 pipNext;
        bool isBuy;
        bool isBase;
        uint128 amount;
        uint32 basisPoint;
        uint128 currentPip;
    }

    struct CrossPipState {
        int256 indexedPipRange;
        uint128 pipTargetStep;
        uint128 sqrtTargetPip;
        bool startIntoIndex;
        bool skipIndex;
    }

    function _onCrossPipAMMTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    ) internal returns (CrossPipResult.Result memory result) {
        CrossPipState memory crossPipState;
        // Have target price
        crossPipState.sqrtTargetPip = _calculateSqrtPrice(
            params.pipNext,
            FixedPoint128.BUFFER
        );
        crossPipState.indexedPipRange = int256(
            LiquidityMath.calculateIndexPipRange(params.pipNext, pipRange)
        );
        params.currentPip = _calculateSqrtPrice(
            params.currentPip,
            FixedPoint128.BUFFER
        );
        for (int256 i = ammState.lastPipRangeLiquidityIndex; ; ) {
            SwapState.AmmReserves memory _ammReserves = ammState.ammReserves[
                ammState.index
            ];
            // Init amm state
            if (
                _ammReserves.baseReserve == 0 && _ammReserves.baseReserve == 0
            ) {
                Liquidity.Info memory _liquidity = liquidityInfo[uint256(i)];

                if (_liquidity.sqrtK != 0) {
                    _ammReserves = _initCrossAmmReserves(_liquidity, ammState); // ammState.ammReserves[ammState.index];
                    if (crossPipState.skipIndex) {
                        crossPipState.skipIndex = false;
                    }
                } else {
                    crossPipState.skipIndex = true;
                }
            }

            if (!crossPipState.skipIndex) {
                if (i != crossPipState.indexedPipRange) {
                    crossPipState.pipTargetStep = params.isBuy
                        ? _ammReserves.sqrtMaxPip
                        : _ammReserves.sqrtMinPip;
                } else {
                    crossPipState.pipTargetStep = crossPipState.sqrtTargetPip;
                }

                if (crossPipState.startIntoIndex) {
                    params.currentPip = params.isBuy
                        ? _ammReserves.sqrtMinPip
                        : _ammReserves.sqrtMaxPip;
                    crossPipState.startIntoIndex = false;
                }

                (uint128 baseOut, uint128 quoteOut) = _calculateAmountOut(
                    _ammReserves,
                    params.isBuy,
                    crossPipState.pipTargetStep,
                    params.currentPip,
                    params.basisPoint
                );

                /// This case for amount no reach pip
                /// Need find price stop
                if (
                    _notReachPip(
                        params,
                        _ammReserves,
                        ammState,
                        baseOut,
                        quoteOut,
                        result
                    )
                ) {
                    break;
                }

                result.updateAmountResult(baseOut, quoteOut);

                _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.index],
                    baseOut,
                    quoteOut
                );
                params.currentPip = crossPipState.pipTargetStep;

                params.amount = params.isBase
                    ? params.amount - baseOut
                    : params.amount - quoteOut;
            }
            i = params.isBuy ? i + 1 : i - 1;
            if (
                (params.isBuy && i > crossPipState.indexedPipRange) ||
                (!params.isBuy && i < crossPipState.indexedPipRange)
            ) {
                result.updatePipResult(params.pipNext);
                break;
            }

            ammState.index = crossPipState.skipIndex
                ? ammState.index
                : ammState.index + 1;
            ammState.lastPipRangeLiquidityIndex = i;
            crossPipState.startIntoIndex = true;
        }
    }

    function _onCrossPipAMMNoTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    ) internal returns (CrossPipResult.Result memory result) {
        CrossPipState memory crossPipState;
        uint8 countSkipIndex;
        Liquidity.Info memory _liquidity;
        params.currentPip = _calculateSqrtPrice(
            params.currentPip,
            FixedPoint128.BUFFER
        );

        while (params.amount != 0) {
            SwapState.AmmReserves memory _ammReserves = ammState.ammReserves[
                ammState.index
            ];
            // Init amm state
            if (
                _ammReserves.baseReserve == 0 && _ammReserves.baseReserve == 0
            ) {
                Liquidity.Info memory _liquidity = liquidityInfo[
                    uint256(ammState.lastPipRangeLiquidityIndex)
                ];

                if (_liquidity.sqrtK != 0) {
                    _ammReserves = _initCrossAmmReserves(_liquidity, ammState);
                    if (crossPipState.skipIndex) {
                        crossPipState.skipIndex = false;
                    }
                } else {
                    crossPipState.skipIndex = true;
                    countSkipIndex++;
                }
            }

            uint128 baseOut;
            uint128 quoteOut;
            if (ammState.ammReserves[ammState.index].sqrtK != 0) {
                crossPipState.pipTargetStep = params.isBuy
                    ? _ammReserves.sqrtMaxPip
                    : _ammReserves.sqrtMinPip;

                if (crossPipState.startIntoIndex) {
                    params.currentPip = params.isBuy
                        ? _ammReserves.sqrtMinPip
                        : _ammReserves.sqrtMaxPip;
                    crossPipState.startIntoIndex = false;
                }

                (baseOut, quoteOut) = _calculateAmountOut(
                    _ammReserves,
                    params.isBuy,
                    crossPipState.pipTargetStep,
                    params.currentPip,
                    params.basisPoint
                );

                if (
                    _notReachPip(
                        params,
                        _ammReserves,
                        ammState,
                        baseOut,
                        quoteOut,
                        result
                    )
                ) {
                    break;
                }

                params.amount = params.isBase
                    ? params.amount - baseOut
                    : params.amount - quoteOut;
                _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.index],
                    baseOut,
                    quoteOut
                );
                params.currentPip = crossPipState.pipTargetStep;
                result.updateAmountResult(baseOut, quoteOut);
                result.updatePipResult(crossPipState.pipTargetStep);
            }

            ammState.lastPipRangeLiquidityIndex = params.isBuy
                ? ammState.lastPipRangeLiquidityIndex + 1
                : ammState.lastPipRangeLiquidityIndex - 1;

            ammState.index = crossPipState.skipIndex
                ? ammState.index
                : ammState.index + 1;
            if (
                ammState.lastPipRangeLiquidityIndex < 0 ||
                ammState.index + countSkipIndex >= 5
            ) {
                ammState.lastPipRangeLiquidityIndex = -2;
                return result;
            }
            crossPipState.startIntoIndex = true;
        }
    }

    function _notReachPip(
        OnCrossPipParams memory params,
        SwapState.AmmReserves memory _ammReserves,
        SwapState.AmmState memory ammState,
        uint128 baseOut,
        uint128 quoteOut,
        CrossPipResult.Result memory result
    ) internal returns (bool) {
        if (
            (params.isBase && params.amount <= baseOut) ||
            (!params.isBase && params.amount <= quoteOut)
        ) {
            (uint128 quoteAmount, uint128 baseAmount) = _calculateAmountFilled(
                params,
                _ammReserves
            );
            result.updateAmountResult(baseAmount, quoteAmount);
            result.updatePipResult(
                _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.index],
                    baseAmount,
                    quoteAmount
                )
            );
            return true;
        }
        return false;
    }

    function _calculateAmountOut(
        SwapState.AmmReserves memory ammReserves,
        bool isBuy,
        uint128 sqrtPriceTarget,
        uint128 sqrtCurrentPrice,
        uint32 basisPoint
    ) internal pure returns (uint128 baseOut, uint128 quoteOut) {
        if (isBuy) {
            baseOut = LiquidityMath.calculateBaseWithPriceWhenBuy(
                sqrtPriceTarget,
                ammReserves.baseReserve,
                sqrtCurrentPrice
            );
            quoteOut =
                LiquidityMath.calculateQuoteWithPriceWhenBuy(
                    sqrtPriceTarget,
                    ammReserves.baseReserve,
                    sqrtCurrentPrice
                ) /
                uint128(basisPoint);
        } else {
            baseOut =
                LiquidityMath.calculateBaseWithPriceWhenSell(
                    sqrtPriceTarget,
                    ammReserves.quoteReserve,
                    sqrtCurrentPrice
                ) *
                uint128(basisPoint);
            quoteOut = LiquidityMath.calculateQuoteWithPriceWhenSell(
                sqrtPriceTarget,
                ammReserves.quoteReserve,
                sqrtCurrentPrice
            );
        }
    }

    function _calculateAmountFilled(
        OnCrossPipParams memory params,
        SwapState.AmmReserves memory ammReserves
    ) internal pure returns (uint128 quoteAmount, uint128 baseAmount) {
        if (params.isBuy) {
            if (params.isBase) {
                quoteAmount = LiquidityMath
                    .calculateQuoteBuyAndBaseSellWithoutTargetPrice(
                        ammReserves.sqrtK,
                        ammReserves.baseReserve,
                        params.amount
                    );
                baseAmount = params.amount;
            } else {
                baseAmount = LiquidityMath
                    .calculateBaseBuyAndQuoteSellWithoutTargetPrice(
                        ammReserves.sqrtK,
                        ammReserves.baseReserve,
                        params.amount
                    );
                quoteAmount = params.amount;
            }
        } else if (!params.isBuy) {
            if (params.isBase) {
                quoteAmount = LiquidityMath
                    .calculateBaseBuyAndQuoteSellWithoutTargetPrice(
                        ammReserves.sqrtK,
                        ammReserves.quoteReserve,
                        params.amount
                    );
                baseAmount = params.amount;
            } else {
                baseAmount = LiquidityMath
                    .calculateQuoteBuyAndBaseSellWithoutTargetPrice(
                        ammReserves.sqrtK,
                        ammReserves.quoteReserve,
                        params.amount
                    );
                quoteAmount = params.amount;
            }
        }
    }

    function _updateAmmState(
        OnCrossPipParams memory params,
        SwapState.AmmReserves memory ammReserves,
        uint128 baseAmount,
        uint128 quoteAmount
    ) internal pure returns (uint128 price) {
        if (
            (ammReserves.baseReserve == 0) ||
            (params.currentPip == ammReserves.sqrtMaxPip)
        ) {
            /// In case into the new pip range have never been reached when sell
            /// So, quoteReal != 0 and baseReal == 0
            /// We need calculate the first baseReal with formula:
            /// (x + a) * (y + b) = k => (x + a) = k/(y+b) = baseReal

            ammReserves.quoteReserve -= quoteAmount;
            ammReserves.baseReserve = uint128(
                (uint256(ammReserves.sqrtK)**2) /
                    uint256(ammReserves.quoteReserve)
            );
        } else if (
            (ammReserves.quoteReserve == 0) ||
            (params.currentPip == ammReserves.sqrtMinPip)
        ) {
            /// In case into the new pip range have never been reached when when buy
            /// So, baseReal != 0 and quoteReal == 0
            /// We need calculate the first baseReal with formula:
            /// (x + a) * (y + b) = k => (y + b) = k/(x+a) = quoteReal
            ammReserves.baseReserve -= baseAmount;
            ammReserves.quoteReserve = uint128(
                (uint256(ammReserves.sqrtK)**2) /
                    uint256(ammReserves.baseReserve)
            );

            /// In case both baseReal !=0 and quoteReal !=0
            /// We can choose many ways to update ammStates
            /// By quote or by base
            /// In this function, we choose to update by quote
        } else if (
            ammReserves.baseReserve != 0 && ammReserves.quoteReserve != 0
        ) {
            if (params.isBuy) {
                ammReserves.baseReserve -= baseAmount;
                ammReserves.quoteReserve = uint128(
                    (uint256(ammReserves.sqrtK)**2) /
                        uint256(ammReserves.baseReserve)
                );
            } else {
                ammReserves.baseReserve += baseAmount;
                ammReserves.quoteReserve = uint128(
                    (uint256(ammReserves.sqrtK)**2) /
                        uint256(ammReserves.baseReserve)
                );
            }
        }

        ammReserves.amountFilled = params.isBuy
            ? ammReserves.amountFilled + baseAmount
            : ammReserves.amountFilled + quoteAmount;

        return
            (ammReserves.quoteReserve * params.basisPoint) /
            ammReserves.baseReserve;
    }

    function _updateAMMStateAfterTrade(
        SwapState.AmmState memory ammState,
        bool isBuy,
        uint16 feePercent
    )
        internal
        returns (
            uint128 totalFeeAmm,
            uint128 feeProtocolAmm,
            uint128 totalFilledAmm
        )
    {
        uint32 _feeShareAmm = feeShareAmm;
        uint128 feeEachIndex;
        uint256 indexedPipRange;
        SwapState.AmmReserves memory ammReserves;
        for (uint8 i = 0; i <= ammState.index; i++) {
            indexedPipRange = ammState.pipRangesIndex[uint256(i)];
            ammReserves = ammState.ammReserves[uint256(i)];
            if (ammReserves.sqrtK == 0) break;
            totalFilledAmm += ammReserves.amountFilled;

            feeEachIndex =
                (ammReserves.amountFilled * feePercent) /
                FixedPoint128.BASIC_POINT_FEE;
            totalFeeAmm += feeEachIndex;

            liquidityInfo[indexedPipRange].updateAMMReserve(
                ammReserves.quoteReserve,
                ammReserves.baseReserve,
                Math.mulDiv(
                    ((feeEachIndex * _feeShareAmm) /
                        FixedPoint128.BASIC_POINT_FEE),
                    FixedPoint128.Q_POW18,
                    ammReserves.sqrtK
                ),
                isBuy
            );
        }

        feeProtocolAmm =
            (totalFeeAmm * (FixedPoint128.BASIC_POINT_FEE - _feeShareAmm)) /
            FixedPoint128.BASIC_POINT_FEE;
    }

    function _initCrossAmmReserves(
        Liquidity.Info memory _liquidity,
        SwapState.AmmState memory ammState
    ) internal returns (SwapState.AmmReserves memory) {
        ammState.ammReserves[ammState.index] = SwapState.AmmReserves({
            baseReserve: _liquidity.baseReal,
            quoteReserve: _liquidity.quoteReal,
            sqrtK: _liquidity.sqrtK,
            sqrtMaxPip: _liquidity.sqrtMaxPip,
            sqrtMinPip: _liquidity.sqrtMinPip,
            amountFilled: 0
        });

        ammState.pipRangesIndex[ammState.index] = uint256(
            ammState.lastPipRangeLiquidityIndex
        );
        return ammState.ammReserves[ammState.index];
    }

    function _calculateSqrtPrice(uint128 pip, uint256 curve)
        internal
        pure
        returns (uint128)
    {
        return (uint256(pip) * curve).sqrt().Uint256ToUint128();
    }

    function _basisPoint() internal view virtual returns (uint256) {}

    function getPipRange() external view override returns (uint128) {
        return pipRange;
    }

    function _onlyCounterParty() internal view virtual {}
}
