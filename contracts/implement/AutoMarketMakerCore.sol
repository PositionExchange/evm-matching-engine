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

import "hardhat/console.sol";

abstract contract AutoMarketMakerCore is IAutoMarketMakerCore, AMMCoreStorage {
    using Liquidity for Liquidity.Info;
    using Math for uint128;
    using Math for uint256;
    using Convert for uint256;

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

        console.log("Initialized: ", currentIndexedPipRange);
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

        state.currentPrice = _calculateSqrtPrice(getCurrentPrice(), 10**18);

        if (_liquidityInfo.sqrtK == 0) {
            (uint128 sqrtPipMin, uint128 sqrtPipMax) = LiquidityMath
                .calculatePipRange(params.indexedPipRange, pipRange);

            _liquidityInfo.sqrtMaxPip = _calculateSqrtPrice(sqrtPipMax, 10**18);
            _liquidityInfo.sqrtMinPip = _calculateSqrtPrice(sqrtPipMin, 10**18);
            console.log(
                "[calculatePipRange] calculatePipRange pipMin ",
                _liquidityInfo.sqrtMinPip,
                params.indexedPipRange
            );
            console.log(
                "[calculatePipRange] calculatePipRange pipMax ",
                _liquidityInfo.sqrtMaxPip,
                params.indexedPipRange
            );
            _liquidityInfo.indexedPipRange = params.indexedPipRange;
        }

        if (params.indexedPipRange < currentIndexedPipRange) {
            state.currentPrice = _liquidityInfo.sqrtMaxPip;
        } else if (params.indexedPipRange > currentIndexedPipRange) {
            state.currentPrice = _liquidityInfo.sqrtMinPip;
        }
        console.log(
            "[addLiquidity] _liquidityInfo.sqrtMinPip :",
            _liquidityInfo.sqrtMinPip
        );
        console.log("[addLiquidity] state.currentPrice :", state.currentPrice);
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
                    .sqrt()
                    .Uint256ToUint128();
            } else if (params.indexedPipRange > currentIndexedPipRange) {
                _liquidityInfo.sqrtK = LiquidityMath
                    .calculateKWithBase(state.baseReal, state.currentPrice)
                    .sqrt()
                    .Uint256ToUint128();
            } else if (params.indexedPipRange == currentIndexedPipRange) {
                console.log("init k");
                _liquidityInfo.sqrtK = LiquidityMath
                    .calculateKWithBaseAndQuote(
                        _liquidityInfo.baseReal,
                        _liquidityInfo.quoteReal
                    )
                    .sqrt()
                    .Uint256ToUint128();
            }
        } else {
            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithBaseAndQuote(
                    _liquidityInfo.baseReal,
                    _liquidityInfo.quoteReal
                )
                .sqrt()
                .Uint256ToUint128();
        }

        console.log(
            "params.indexedPipRange: ",
            params.indexedPipRange,
            _liquidityInfo.sqrtK
        );
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
                .sqrt()
                .Uint256ToUint128();
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
                .sqrt()
                .Uint256ToUint128();
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

            _liquidityInfo.sqrtK = LiquidityMath
                .calculateKWithBaseAndQuote(
                    _liquidityInfo.baseReal - baseAmount,
                    _liquidityInfo.quoteReal - quoteAmount
                )
                .sqrt()
                .Uint256ToUint128();
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
        console.log("_onCrossPipAMMTargetPrice");

        CrossPipState memory crossPipState;
        // Have target price
        crossPipState.sqrtTargetPip = _calculateSqrtPrice(
            params.pipNext,
            10**18
        );
        crossPipState.indexedPipRange = int256(
            LiquidityMath.calculateIndexPipRange(params.pipNext, pipRange)
        );
        console.log(
            "crossPipState.indexedPipRange: ",
            uint256(crossPipState.indexedPipRange)
        );
        console.log(
            "ammState.lastPipRangeLiquidityIndex: ",
            uint256(ammState.lastPipRangeLiquidityIndex)
        );
        console.log("params.pipNext: ", uint256(params.pipNext));
        console.log(
            "ammState.pipRangeLiquidityIndex: ",
            uint256(ammState.pipRangeLiquidityIndex)
        );
        for (int256 i = ammState.lastPipRangeLiquidityIndex; ; ) {
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                ammState.pipRangeLiquidityIndex
            ];
            // Init amm state
            if (ammReserves.baseReserve == 0 && ammReserves.baseReserve == 0) {
                if (
                    liquidityInfo[uint256(i)].baseReal == 0 &&
                    liquidityInfo[uint256(i)].quoteReal == 0
                ) {
                    break;
                }
                ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ] = SwapState.AmmReserves({
                    baseReserve: liquidityInfo[uint256(i)].baseReal,
                    quoteReserve: liquidityInfo[uint256(i)].quoteReal,
                    sqrtK: liquidityInfo[uint256(i)].sqrtK
                });
                console.log(
                    "sqrtk: ",
                    uint256(liquidityInfo[uint256(i)].sqrtK),
                    uint256(i)
                );
                console.log(
                    "base real: ",
                    liquidityInfo[uint256(i)].baseReal,
                    uint256(i)
                );
                console.log(
                    "quote real: ",
                    liquidityInfo[uint256(i)].quoteReal,
                    uint256(i)
                );
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
            pipRangeLiquidityIndex = uint256(
                ammState.lastPipRangeLiquidityIndex
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

                console.log(
                    "not reach pip. params.amount: ",
                    params.amount,
                    baseAmount,
                    quoteAmount
                );

                /// update amm state memory
                toPip = _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                    baseAmount,
                    quoteAmount
                );
                console.log(
                    "after update base",
                    ammState
                        .ammReserves[ammState.pipRangeLiquidityIndex]
                        .baseReserve
                );
                console.log(
                    "after update quote",
                    ammState
                        .ammReserves[ammState.pipRangeLiquidityIndex]
                        .quoteReserve
                );
                params.amount = 0;
                break;
            }
            //            console.log("crossPipState.pipTargetStep: ", crossPipState.pipTargetStep);

            baseCrossPipOut += baseOut;
            quoteCrossPipOut += quoteOut;

            _updateAmmState(
                params,
                ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                baseOut,
                quoteOut
            );

            console.log("params.amount: ", params.amount);
            console.log("baseOut: ", baseOut);

            if (params.isBase) {
                params.amount -= baseOut;
            } else {
                params.amount -= quoteOut;
            }
            i = params.isBuy ? i + 1 : i - 1;

            console.log(
                "params.isBuy: ",
                params.isBuy,
                uint256(crossPipState.indexedPipRange),
                uint256(i)
            );
            if (
                (params.isBuy && i > crossPipState.indexedPipRange) ||
                (!params.isBuy && i < crossPipState.indexedPipRange)
            ) {
                toPip = params.pipNext;
                break;
            }
            console.log("plus pipRangeLiquidityIndex");
            ammState.pipRangeLiquidityIndex += 1;
            console.log(
                "[AutoMarketMakerCore][_updateAmmState] ammReserves.quoteReserve: ",
                ammReserves.quoteReserve,
                ammReserves.baseReserve
            );
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
        console.log("_onCrossPipAMMNoTargetPrice: ", params.amount);
        CrossPipState memory crossPipState;
        while (params.amount != 0) {
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                ammState.pipRangeLiquidityIndex
            ];
            console.log(
                "lastPipRangeLiquidityIndex: ",
                uint256(ammState.lastPipRangeLiquidityIndex)
            );
            // Init amm state
            if (ammReserves.baseReserve == 0 && ammReserves.baseReserve == 0) {
                console.log("init state");
                ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ] = SwapState.AmmReserves({
                    baseReserve: liquidityInfo[
                        uint256(ammState.lastPipRangeLiquidityIndex)
                    ].baseReal,
                    quoteReserve: liquidityInfo[
                        uint256(ammState.lastPipRangeLiquidityIndex)
                    ].quoteReal,
                    sqrtK: liquidityInfo[
                        uint256(ammState.lastPipRangeLiquidityIndex)
                    ].sqrtK
                });

                ammState.pipRangesIndex[
                    ammState.pipRangeLiquidityIndex
                ] = uint256(ammState.pipRangeLiquidityIndex);
                ammReserves = ammState.ammReserves[
                    ammState.pipRangeLiquidityIndex
                ];
            }

            console.log(
                "ammState.pipRangeLiquidityIndex and maxPip: ",
                uint256(ammState.lastPipRangeLiquidityIndex),
                liquidityInfo[uint256(ammState.lastPipRangeLiquidityIndex)]
                    .sqrtMinPip
            );
            crossPipState.pipTargetStep = params.isBuy
                ? liquidityInfo[uint256(ammState.lastPipRangeLiquidityIndex)]
                    .sqrtMaxPip
                : liquidityInfo[uint256(ammState.lastPipRangeLiquidityIndex)]
                    .sqrtMinPip;

            console.log(
                "crossPipState.pipTargetStep: ",
                crossPipState.pipTargetStep
            );

            (uint128 baseOut, uint128 quoteOut) = _calculateAmountOut(
                ammReserves,
                params.isBuy,
                crossPipState.pipTargetStep,
                _calculateSqrtPrice(ammState.currentPip, 10**18),
                params.basisPoint
            );
            console.log("baseOut, quoteOut: ", baseOut, quoteOut);
            if (
                (params.isBase && params.amount <= baseOut) ||
                (!params.isBase && params.amount <= quoteOut)
            ) {
                (uint128 quoteAmount, uint128 baseAmount) = _findPriceTarget(
                    params,
                    ammReserves
                );
                console.log("baseCrossPipOut: ", baseCrossPipOut);
                console.log("quoteCrossPipOut: ", quoteCrossPipOut);
                baseCrossPipOut += baseAmount;
                quoteCrossPipOut += quoteAmount;

                pipRangeLiquidityIndex = uint256(
                    ammState.lastPipRangeLiquidityIndex
                );

                /// update amm state memory
                toPip = _updateAmmState(
                    params,
                    ammState.ammReserves[ammState.pipRangeLiquidityIndex],
                    baseAmount,
                    quoteAmount
                );
                params.amount = 0;
                break;
            }

            console.log("params.amount: ", params.amount);

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
        console.log("basisPoint", basisPoint);
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
            console.log(
                "[AutoMarketMakerCore][_calculateAmountOut] sqrtPriceTarget: ",
                sqrtPriceTarget
            );
            console.log(
                "[AutoMarketMakerCore][_calculateAmountOut] ammReserves.quoteReserve: ",
                ammReserves.quoteReserve
            );
            console.log(
                "[AutoMarketMakerCore][_calculateAmountOut] sqrtCurrentPrice: ",
                sqrtCurrentPrice
            );
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
        if ((ammReserves.baseReserve == 0)) {
            /// In case into the new pip range have never been reached when when sell
            /// So, quoteReal != 0 and baseReal == 0
            /// We need calculate the first baseReal with formula:
            /// (x + a) * (y + b) = k => (x + a) = k/(y+b) = baseReal
            console.log(
                "[AutoMarketMakerCore][_updateAmmState] ammReserves.quoteReserve: ",
                ammReserves.quoteReserve,
                ammReserves.baseReserve
            );
            ammReserves.quoteReserve -= quoteAmount;
            ammReserves.baseReserve = uint128(
                (uint256(ammReserves.sqrtK)**2) /
                    uint256(ammReserves.quoteReserve)
            );
        } else if ((ammReserves.quoteReserve == 0)) {
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
                console.log(
                    "[AutoMarketMakerCore][_updateAmmState] buy ammReserves.quoteReserve1: ",
                    ammReserves.quoteReserve,
                    ammReserves.baseReserve,
                    ammReserves.sqrtK
                );
                console.log("[AutoMarketMakerCore]: buy ", baseAmount);
                ammReserves.baseReserve -= baseAmount;
                ammReserves.quoteReserve = uint128(
                    (uint256(ammReserves.sqrtK)**2) /
                        uint256(ammReserves.baseReserve)
                );
                console.log(
                    "[AutoMarketMakerCore][_updateAmmState]  buy ammReserves.quoteReserve2: ",
                    ammReserves.quoteReserve,
                    ammReserves.baseReserve,
                    ammReserves.sqrtK
                );
            } else {
                console.log(
                    "[AutoMarketMakerCore][_updateAmmState] ammReserves.quoteReserve1: ",
                    ammReserves.quoteReserve,
                    ammReserves.baseReserve,
                    ammReserves.sqrtK
                );
                console.log("[AutoMarketMakerCore]: ", baseAmount);
                ammReserves.baseReserve += baseAmount;
                ammReserves.quoteReserve = uint128(
                    (uint256(ammReserves.sqrtK)**2) /
                        uint256(ammReserves.baseReserve)
                );
                console.log(
                    "[AutoMarketMakerCore][_updateAmmState] ammReserves.quoteReserve2: ",
                    ammReserves.quoteReserve,
                    ammReserves.baseReserve,
                    ammReserves.sqrtK
                );
            }
        }

        return
            (ammReserves.quoteReserve * params.basisPoint) /
            ammReserves.baseReserve;
    }

    function _updateAMMStateAfterTrade(SwapState.AmmState memory ammState)
        internal
    {
        console.log(
            "[AutoMarketMakerCore][_updateAMMStateAfterTrade] ",
            ammState.pipRangeLiquidityIndex
        );
        for (uint8 i = 0; i <= ammState.pipRangeLiquidityIndex; i++) {
            uint256 indexedPipRange = ammState.pipRangesIndex[uint256(i)];
            SwapState.AmmReserves memory ammReserves = ammState.ammReserves[
                uint256(i)
            ];

            console.log(
                "[AutoMarketMakerCore][_updateAMMStateAfterTrade] ",
                ammReserves.quoteReserve,
                ammReserves.baseReserve
            );

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
}
