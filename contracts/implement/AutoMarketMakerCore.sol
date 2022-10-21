/**
 * @author Musket
 */
pragma solidity ^0.8.9;

import "../libraries/types/AMMCoreStorage.sol";
import "../libraries/helper/Math.sol";
import "../libraries/helper/LiquidityMath.sol";
import "../interfaces/IAutoMarketMakerCore.sol";
import "../libraries/exchange/SwapState.sol";
import "../libraries/helper/Convert.sol";

abstract contract AutoMarketMakerCore is IAutoMarketMakerCore, AMMCoreStorage {
    using Liquidity for Liquidity.Info;
    using Math for uint128;
    using Math for uint256;
    using Convert for uint256;

    uint256 public constant CURVE_PIP = 1 * 18;

    function _initializeAMM(uint128 _pipRange, uint32 _tickSpace) internal {
        pipRange = _pipRange;
        tickSpace = _tickSpace;
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
            uint128 liquidity,
            uint256 feeGrowthBase,
            uint256 feeGrowthQuote
        )
    {
        AddLiquidityState memory state;
        Liquidity.Info memory _liquidityInfo = liquidityInfo[
            params.indexedPipRange
        ];

        state.currentPrice = getCurrentPrice();

        if (_liquidityInfo.sqrtK == 0) {
            (uint128 sqrtPipMin, uint128 sqrtPipMax) = LiquidityMath
                .calculatePipRange(params.indexedPipRange, pipRange);
            _liquidityInfo.sqrtMaxPip = _calculateSqrtPrice(sqrtPipMax, 10**18);
            _liquidityInfo.sqrtMinPip = _calculateSqrtPrice(sqrtPipMin, 10**18);
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
        _liquidityInfo.liquidity += liquidity;

        if (_liquidityInfo.sqrtK == 0) {
            if (params.indexedPipRange < currentIndexedPipRange) {
                _liquidityInfo.sqrtK = LiquidityMath
                    .calculateKWithQuote(state.quoteReal, state.currentPrice)
                    .sqrt128();
            } else if (params.indexedPipRange > currentIndexedPipRange) {
                _liquidityInfo.sqrtK = LiquidityMath
                    .calculateKWithBase(state.baseReal, state.currentPrice)
                    .sqrt128();
            }
        } else {
            _liquidityInfo.sqrtK = LiquidityMath.calculateKWithBaseAndQuote(
                _liquidityInfo.baseReal,
                _liquidityInfo.quoteReal
            );
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
        Liquidity.Info memory _liquidityInfo = liquidityInfo[
            params.indexedPipRange
        ];
        require(_liquidityInfo.liquidity >= params.liquidity, "Liquidity");
        if (params.indexedPipRange < currentIndexedPipRange) {
            quoteAmount = LiquidityMath.calculateQuoteByLiquidity(
                params.liquidity,
                _liquidityInfo.sqrtMinPip,
                _liquidityInfo.sqrtMaxPip
            );

            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithQuote(
                    _liquidityInfo.quoteReal - quoteAmount,
                    _liquidityInfo.sqrtMaxPip
                )
                .sqrt128();
        } else if (params.indexedPipRange > currentIndexedPipRange) {
            baseAmount = LiquidityMath.calculateBaseByLiquidity(
                params.liquidity,
                _liquidityInfo.sqrtMaxPip,
                _liquidityInfo.sqrtMinPip
            );
            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithBase(
                    _liquidityInfo.baseReal - baseAmount,
                    _liquidityInfo.sqrtMinPip
                )
                .sqrt128();
        } else {
            uint128 currentPrice = getCurrentPrice();
            baseAmount = LiquidityMath.calculateBaseByLiquidity(
                params.liquidity,
                _liquidityInfo.sqrtMaxPip,
                currentPrice
            );
            quoteAmount = LiquidityMath.calculateQuoteByLiquidity(
                params.liquidity,
                _liquidityInfo.sqrtMinPip,
                currentPrice
            );

            _liquidityInfo.sqrtK = LiquidityMath.calculateKWithBaseAndQuote(
                _liquidityInfo.baseReal - baseAmount,
                _liquidityInfo.quoteReal - quoteAmount
            );
        }

        _liquidityInfo.baseReal -= baseAmount;
        _liquidityInfo.quoteReal -= quoteAmount;
        _liquidityInfo.liquidity -= params.liquidity;

        liquidityInfo[params.indexedPipRange].updateAddLiquidity(
            _liquidityInfo
        );
    }

    function collectFee(uint256 feeGrowthBase, uint256 feeGrowthQuote)
        external
        virtual
        returns (uint256 baseAmount, uint256 quoteAmount)
    {
        return (0, 0);
    }

    function getCurrentPrice() internal view virtual returns (uint128) {}

    struct OnCrossPipParams {
        uint128 pipNext;
        bool isBuy;
        bool isBase;
        uint128 amount;
        uint32 basisPoint;
    }

    struct CrossPipState {
        int256 indexedPipRange;
        uint128 pipTargetStep;
        uint128 sqrtTargetPip;
    }

    function _onCrossPipAMMTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        returns (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint256 pipRangeLiquidityIndex,
            uint128 toPip
        )
    {
        CrossPipState memory crossPipState;
        // Have target price
        crossPipState.sqrtTargetPip = _calculateSqrtPrice(
            params.pipNext,
            10**18
        );
        crossPipState.indexedPipRange = int256(
            LiquidityMath.calculateIndexPipRange(params.pipNext, pipRange)
        );
        for (
            int256 i = ammState.lastPipRangeLiquidityIndex;
            i <= crossPipState.indexedPipRange;

        ) {
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                ammState.pipRangeLiquidityIndex
            ];
            // Init amm state
            if (ammReserves.baseReserve == 0 && ammReserves.baseReserve == 0) {
                ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ] = SwapState.AmmReserves({
                    baseReserve: liquidityInfo[uint256(i)].baseReal,
                    quoteReserve: liquidityInfo[uint256(i)].quoteReal,
                    sqrtK: liquidityInfo[uint256(i)].sqrtK
                });
                ammState.pipRangesIndex[
                    ammState.pipRangeLiquidityIndex
                ] = uint256(i);
                ammReserves = ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ];
            }

            if (
                ammState.lastPipRangeLiquidityIndex !=
                crossPipState.indexedPipRange
            ) {
                crossPipState.pipTargetStep = params.isBuy
                    ? liquidityInfo[uint256(i)].sqrtMaxPip
                    : liquidityInfo[uint256(i)].sqrtMinPip;
            } else {
                crossPipState.pipTargetStep = crossPipState.sqrtTargetPip;
            }

            (uint128 baseOut, uint128 quoteOut) = _calculateAmountOut(
                ammReserves,
                params.isBuy,
                crossPipState.pipTargetStep,
                _calculateSqrtPrice(ammState.currentPip, 10**18),
                params.basisPoint
            );

            /// This case for amount no reach pip
            /// Need find price stop
            if (
                (params.isBase && params.amount <= baseOut) ||
                (!params.isBase && params.amount <= quoteOut)
            ) {
                (uint128 quoteAmount, uint128 baseAmount) = _findPriceTarget(
                    params,
                    ammReserves
                );
                baseCrossPipOut += baseAmount;
                quoteCrossPipOut += quoteAmount;

                pipRangeLiquidityIndex = uint256(
                    ammState.lastPipRangeLiquidityIndex
                );

                /// update amm state memory
                toPip = _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                    baseOut,
                    quoteOut
                );
                params.amount = 0;
                break;
            }

            _updateAmmState(
                params,
                ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                baseOut,
                quoteOut
            );

            if (params.isBase) {
                params.amount -= baseOut;
            } else {
                params.amount -= quoteOut;
            }
            i = params.isBuy ? i + 1 : i - 1;
            ammState.pipRangeLiquidityIndex += 1;
        }
    }

    function _onCrossPipAMMNoTargetPrice(
        OnCrossPipParams memory params,
        SwapState.AmmState memory ammState
    )
        internal
        returns (
            uint128 baseCrossPipOut,
            uint128 quoteCrossPipOut,
            uint256 pipRangeLiquidityIndex,
            uint128 toPip
        )
    {
        CrossPipState memory crossPipState;
        while (params.amount != 0) {
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                ammState.pipRangeLiquidityIndex
            ];
            // Init amm state
            if (ammReserves.baseReserve == 0 && ammReserves.baseReserve == 0) {
                ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ] = SwapState.AmmReserves({
                    baseReserve: liquidityInfo[
                        uint256(ammState.pipRangeLiquidityIndex)
                    ].baseReal,
                    quoteReserve: liquidityInfo[
                        uint256(ammState.pipRangeLiquidityIndex)
                    ].quoteReal,
                    sqrtK: liquidityInfo[
                        uint256(ammState.pipRangeLiquidityIndex)
                    ].sqrtK
                });

                ammState.pipRangesIndex[
                    ammState.pipRangeLiquidityIndex
                ] = uint256(ammState.pipRangeLiquidityIndex);
                ammReserves = ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ];
            }
            crossPipState.pipTargetStep = params.isBuy
                ? liquidityInfo[uint256(ammState.pipRangeLiquidityIndex)]
                    .sqrtMaxPip
                : liquidityInfo[uint256(ammState.pipRangeLiquidityIndex)]
                    .sqrtMinPip;

            (uint128 baseOut, uint128 quoteOut) = _calculateAmountOut(
                ammReserves,
                params.isBuy,
                crossPipState.pipTargetStep,
                _calculateSqrtPrice(ammState.currentPip, 10**18),
                params.basisPoint
            );
            if (
                (params.isBase && params.amount <= baseOut) ||
                (!params.isBase && params.amount <= quoteOut)
            ) {
                baseCrossPipOut += baseOut;
                quoteCrossPipOut += quoteOut;

                (uint128 quoteAmount, uint128 baseAmount) = _findPriceTarget(
                    params,
                    ammReserves
                );
                pipRangeLiquidityIndex = uint256(
                    ammState.lastPipRangeLiquidityIndex
                );

                /// update amm state memory
                toPip = _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                    baseOut,
                    quoteOut
                );
                params.amount = 0;
                break;
            }

            if (params.isBase) {
                params.amount -= baseOut;
            } else {
                params.amount -= quoteOut;
            }
            ammState.lastPipRangeLiquidityIndex = params.isBuy
                ? ammState.lastPipRangeLiquidityIndex + 1
                : ammState.lastPipRangeLiquidityIndex - 1;
            ammState.pipRangeLiquidityIndex += 1;
        }
    }

    function _calculateAmountOut(
        SwapState.AmmReserves memory ammReserves,
        bool isBuy,
        uint128 sqrtCurrentPrice,
        uint128 sqrtPriceTarget,
        uint32 basisPoint
    ) internal pure returns (uint128 baseOut, uint128 quoteOut) {
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
            quoteOut =
                LiquidityMath.calculateQuoteWithPriceWhenSell(
                    sqrtPriceTarget,
                    ammReserves.quoteReserve,
                    sqrtCurrentPrice
                ) /
                uint128(basisPoint);
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
                        ammReserves.quoteReserve,
                        params.amount
                    );
                quoteAmount = params.amount;
            }
        } else if (!params.isBuy) {
            if (params.isBase) {
                quoteAmount = LiquidityMath
                    .calculateBaseBuyAndQuoteSellWithoutTargetPrice(
                        ammReserves.sqrtK,
                        ammReserves.baseReserve,
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
        if ((ammReserves.baseReserve == 0)) {
            /// In case into the new pip range have never been reached when when sell
            /// So, quoteReal != 0 and baseReal == 0
            /// We need calculate the first baseReal with formula:
            /// (x + a) * (y + b) = k => (x + a) = k/(y+b) = baseReal
            ammReserves.quoteReserve -= quoteAmount;
            ammReserves.baseReserve =
                (ammReserves.sqrtK * 2) /
                ammReserves.quoteReserve;
        } else if (
            (ammReserves.quoteReserve == 0) ||
            ((ammReserves.baseReserve != 0 && ammReserves.quoteReserve != 0))
        ) {
            /// In case into the new pip range have never been reached when when buy
            /// So, baseReal != 0 and quoteReal == 0
            /// We need calculate the first baseReal with formula:
            /// (x + a) * (y + b) = k => (y + b) = k/(x+a) = quoteReal
            ammReserves.baseReserve -= baseAmount;
            ammReserves.quoteReserve =
                (ammReserves.sqrtK * 2) /
                ammReserves.baseReserve;
            /// In case both baseReal !=0 and quoteReal !=0
            /// We can choose many ways to update ammStates
            /// By quote or by base
            /// In this function, we choose to update by quote
        }

        return ammReserves.quoteReserve / ammReserves.baseReserve;
    }

    function _updateAMMStateAfterTrade(SwapState.AmmState memory ammState)
        internal
    {
        for (uint8 i = 0; i < ammState.pipRangeLiquidityIndex; i++) {
            uint256 indexedPipRange = ammState.pipRangesIndex[uint256(i)];
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                uint256(i)
            ];

            liquidityInfo[indexedPipRange].updateAMMReserve(
                ammReserves.quoteReserve,
                ammReserves.baseReserve
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

    function getPipRange() external view override returns (uint128) {
        return pipRange;
    }
}
