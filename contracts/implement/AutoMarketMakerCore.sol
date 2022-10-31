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
import "hardhat/console.sol";

abstract contract AutoMarketMakerCore is IAutoMarketMakerCore, AMMCoreStorage {
    using Liquidity for Liquidity.Info;
    using Math for uint128;
    using Math for uint256;
    using Convert for uint256;
    using CrossPipResult for CrossPipResult.Result;

    uint256 public constant CURVE_PIP = 1 * 18;

    function _initializeAMM(
        uint128 _pipRange,
        uint32 _tickSpace,
        uint128 _initPip
    ) internal {
        pipRange = _pipRange;
        tickSpace = _tickSpace;

        currentIndexedPipRange = LiquidityMath.calculateIndexPipRange(
            _initPip,
            _pipRange
        );
    }

    struct AddLiquidityState {
        uint128 currentPrice;
        uint128 quoteReal;
        uint128 baseReal;
    }

    function addLiquidity(AddLiquidity calldata params)
        external
        virtual
        returns (
            uint128 baseAmountAdded,
            uint128 quoteAmountAdded,
            uint256 liquidity,
            uint256 feeGrowthBase,
            uint256 feeGrowthQuote
        )
    {
        AddLiquidityState memory state;
        Liquidity.Info memory _liquidityInfo = liquidityInfo[
            params.indexedPipRange
        ];

        state.currentPrice = _calculateSqrtPrice(getCurrentPip(), 10**18);

        if (_liquidityInfo.sqrtK == 0) {
            (uint128 PipMin, uint128 PipMax) = LiquidityMath.calculatePipRange(
                params.indexedPipRange,
                pipRange
            );

            _liquidityInfo.sqrtMaxPip = _calculateSqrtPrice(PipMax, 10**18);
            _liquidityInfo.sqrtMinPip = _calculateSqrtPrice(PipMin, 10**18);
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

        liquidity = state.baseReal != 0
            ? LiquidityMath.calculateLiquidity(
                state.baseReal,
                state.currentPrice,
                true
            )
            : LiquidityMath.calculateLiquidity(
                state.quoteReal,
                state.currentPrice,
                false
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
            //            if (params.indexedPipRange < currentIndexedPipRange){
            //                _liquidityInfo.baseReal =
            //                (_liquidityInfo.sqrtK**2) /
            //                _liquidityInfo.quoteReal;
            //            }
        } else if (
            (params.indexedPipRange > currentIndexedPipRange) ||
            ((params.indexedPipRange == currentIndexedPipRange) &&
                (state.currentPrice == _liquidityInfo.sqrtMinPip))
        ) {
            _liquidityInfo.sqrtK = (LiquidityMath.calculateKWithBase(
                _liquidityInfo.baseReal,
                state.currentPrice
            ) / _basisPoint()).sqrt().Uint256ToUint128();
            //            if (params.indexedPipRange < currentIndexedPipRange){
            //                _liquidityInfo.quoteReal =
            //                    (_liquidityInfo.sqrtK**2) /
            //                    _liquidityInfo.baseReal;
            //            }
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
            baseAmountAdded,
            params.quoteAmount,
            liquidity,
            _liquidityInfo.feeGrowthBase,
            _liquidityInfo.feeGrowthQuote
        );
    }

    function removeLiquidity(RemoveLiquidity calldata params)
        external
        virtual
        returns (uint128 baseAmount, uint128 quoteAmount)
    {
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
        uint128 quoteVirtualRemove = LiquidityMath
            .calculateQuoteRealByLiquidity(
                params.liquidity,
                _liquidityInfo.sqrtK,
                _liquidityInfo.quoteReal
            );
        _liquidityInfo.quoteReal = _liquidityInfo.quoteReal > quoteVirtualRemove
            ? _liquidityInfo.quoteReal - quoteVirtualRemove
            : 0;
        uint128 baseVirtualRemove = LiquidityMath.calculateBaseRealByLiquidity(
            params.liquidity,
            _liquidityInfo.sqrtK,
            _liquidityInfo.baseReal
        );
        _liquidityInfo.baseReal = _liquidityInfo.baseReal > baseVirtualRemove
            ? _liquidityInfo.baseReal - baseVirtualRemove
            : 0;

        uint128 sqrtBasicPoint = uint256(_basisPoint())
            .sqrt()
            .Uint256ToUint128();

        uint128 _currentPrice = _calculateSqrtPrice(getCurrentPip(), 10**18);

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

    function collectFee(
        uint256 feeGrowthBase,
        uint256 feeGrowthQuote,
        uint128 liquidity,
        uint32 indexedPipRange
    )
        public
        view
        virtual
        returns (
            uint256 baseAmount,
            uint256 quoteAmount,
            uint256 newFeeGrowthBase,
            uint256 newFeeGrowthQuote
        )
    {
        Liquidity.Info memory _liquidityInfo = liquidityInfo[indexedPipRange];

        baseAmount = Math.mulDiv(
            _liquidityInfo.feeGrowthBase,
            liquidity,
            FixedPoint128.Q128
        );
        quoteAmount = Math.mulDiv(
            _liquidityInfo.feeGrowthQuote,
            liquidity,
            FixedPoint128.Q128
        );
        return (
            baseAmount,
            quoteAmount,
            _liquidityInfo.feeGrowthBase,
            _liquidityInfo.feeGrowthQuote
        );
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
    }

    function _onCrossPipAMMTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    ) internal returns (CrossPipResult.Result memory result) {
        CrossPipState memory crossPipState;
        // Have target price
        crossPipState.sqrtTargetPip = _calculateSqrtPrice(
            params.pipNext,
            10**18
        );
        crossPipState.indexedPipRange = int256(
            LiquidityMath.calculateIndexPipRange(params.pipNext, pipRange)
        );
        params.currentPip = _calculateSqrtPrice(params.currentPip, 10**18);
        for (int256 i = ammState.lastPipRangeLiquidityIndex; ; ) {
            SwapState.AmmReserves memory _ammReserves = ammState.ammReserves[
                ammState.index
            ];
            // Init amm state
            if (
                _ammReserves.baseReserve == 0 && _ammReserves.baseReserve == 0
            ) {
                Liquidity.Info memory _liquidity = liquidityInfo[uint256(i)];
                if (_liquidity.baseReal == 0 && _liquidity.quoteReal == 0) {
                    break;
                }
                ammState.ammReserves[ammState.index] = SwapState.AmmReserves({
                    baseReserve: _liquidity.baseReal,
                    quoteReserve: _liquidity.quoteReal,
                    sqrtK: _liquidity.sqrtK,
                    sqrtMaxPip: _liquidity.sqrtMaxPip,
                    sqrtMinPip: _liquidity.sqrtMinPip,
                    feeAmount: 0
                });
                ammState.pipRangesIndex[ammState.index] = uint256(i);
                _ammReserves = ammState.ammReserves[ammState.index];
            }

            if (_ammReserves.sqrtK != 0) {
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
            ammState.index += 1;
            ammState.lastPipRangeLiquidityIndex = i;
            crossPipState.startIntoIndex = true;
        }
    }

    function _onCrossPipAMMNoTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    ) internal returns (CrossPipResult.Result memory result) {
        CrossPipState memory crossPipState;
        params.currentPip = _calculateSqrtPrice(params.currentPip, 10**18);

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

                ammState.ammReserves[ammState.index] = SwapState.AmmReserves({
                    baseReserve: _liquidity.baseReal,
                    quoteReserve: _liquidity.quoteReal,
                    sqrtK: _liquidity.sqrtK,
                    sqrtMaxPip: _liquidity.sqrtMaxPip,
                    sqrtMinPip: _liquidity.sqrtMinPip,
                    feeAmount: 0
                });

                ammState.pipRangesIndex[ammState.index] = uint256(
                    ammState.lastPipRangeLiquidityIndex
                );
                _ammReserves = ammState.ammReserves[ammState.index];
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

            ammState.index += 1;
            if (
                ammState.lastPipRangeLiquidityIndex < 0 || ammState.index >= 5
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
            (uint128 quoteAmount, uint128 baseAmount) = _findPriceTarget(
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
    )
        internal
        view
        returns (
            // TODO change view to pure
            uint128 baseOut,
            uint128 quoteOut
        )
    {
        if (isBuy) {
            baseOut = LiquidityMath.calculateBaseWithPriceWhenBuy(
                sqrtPriceTarget,
                ammReserves.baseReserve,
                sqrtCurrentPrice
            );
            quoteOut = LiquidityMath.calculateQuoteWithPriceWhenBuy(
                sqrtPriceTarget,
                ammReserves.baseReserve,
                sqrtCurrentPrice
            );
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

    function _findPriceTarget(
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
    ) internal returns (uint128 price) {
        if (
            (ammReserves.baseReserve == 0) ||
            (params.currentPip == ammReserves.sqrtMaxPip)
        ) {
            /// In case into the new pip range have never been reached when when sell
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
            ((ammReserves.baseReserve != 0 && ammReserves.quoteReserve != 0))
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

        return
            (ammReserves.quoteReserve * params.basisPoint) /
            ammReserves.baseReserve;
    }

    function _updateAMMStateAfterTrade(
        SwapState.AmmState memory ammState,
        bool isBuy
    ) internal {
        for (uint8 i = 0; i <= ammState.index; i++) {
            uint256 indexedPipRange = ammState.pipRangesIndex[uint256(i)];
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                uint256(i)
            ];
            if (ammReserves.sqrtK == 0) break;

            uint256 feeGrowth = Math.mulDiv(
                ammReserves.feeAmount,
                FixedPoint128.Q128,
                ammReserves.sqrtK
            );

            liquidityInfo[indexedPipRange].updateAMMReserve(
                ammReserves.quoteReserve,
                ammReserves.baseReserve,
                feeGrowth,
                isBuy
            );
        }
    }

    function _calculateSqrtPrice(uint128 pip, uint256 curve)
        internal
        view
        returns (uint128)
    {
        return (uint256(pip) * curve).sqrt().Uint256ToUint128();
    }

    function _basisPoint() internal view virtual returns (uint256) {}

    function getPipRange() external view override returns (uint128) {
        return pipRange;
    }
}
