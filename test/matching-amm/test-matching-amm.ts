import {expect} from "chai";
import YAML from "js-yaml";
import {MatchingEngineAMM, MockToken} from "../../typeChain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {fromWei, getAccount, SIDE, toWei} from "../utils/utils";
import {BigNumber, ethers} from "ethers";
import {YamlTestProcess} from "./yaml-test-process";
import Decimal from "decimal.js";

export type SNumber = number | string | BigNumber
export type StringOrNumber = string | number

export interface CallOptions {
    sender?: SignerWithAddress;
    poolId?: string;
    [k: string]: any
}

export interface PoolLiquidityInfo {
    pairManager: string;
    strategy: string;
    totalQuoteDeposited: BigNumber;
    totalFundingCertificates: BigNumber;
    baseLiquidity: BigNumber;
    quoteLiquidity: BigNumber;
    soRemovablePosBuy: BigNumber;
    soRemovablePosSell: BigNumber;
}

interface ExpectRemoveLiquidity {
    baseOut: StringOrNumber;
    quoteOut: StringOrNumber;
    totalReceiveInQuote?: StringOrNumber;
    pnl?: StringOrNumber;
    poolExpect?: ExpectedPoolData;
}


export interface ExpectedPoolData {
    quoteLiquidity?: StringOrNumber;
    baseLiquidity?: StringOrNumber;
    netAssetValue?: SNumber;
    totalQuoteDeposited?: SNumber;
    poolPnL?: SNumber;
    quoteDeposited?: SNumber;
    totalFC? : StringOrNumber
}
export interface ExpectAddLiquidityResult extends ExpectedPoolData {
    userDebt?: StringOrNumber;
}


function pipToPrice(currentPip: StringOrNumber) {
    return Number(currentPip) / 100000;
}

function price2Pip(currentPrice: number | string) {
    return new Decimal(currentPrice).mul(100000).toNumber();
}

function fromWeiAndFormat(n, decimal = 6): number{
    return new Decimal(fromWei(n).toString()).toDP(decimal).toNumber()
}

function roundNumber(n, decimal = 6){
    return new Decimal((n).toString()).toDP(decimal).toNumber()
}


export class TestMatchingAmm {
    ins: MatchingEngineAMM;
    defaultPoolId: string;
    defaultSender: SignerWithAddress;
    nftTokenId: number = 1000000;
    baseToken: MockToken;
    quoteToken: MockToken;
    // @notice fee in %
    spotFee: number;
    verbose = true;

    constructor(_ins: MatchingEngineAMM, _defaultPoolId: string, _defaultSender: SignerWithAddress, opts: {
        baseToken: MockToken,
        quoteToken: MockToken
        spotFee: number
    }) {
        this.ins = _ins;
        this.defaultPoolId = _defaultPoolId;
        this.defaultSender = _defaultSender;
        this.baseToken = opts.baseToken;
        this.quoteToken = opts.quoteToken;
        this.spotFee = opts.spotFee ?? 0;
    }

    async printPoolData(poolId) {
        // const poolData = await this.getPoolData(poolId);
        // const poolLiquidity = await this.ins.getPoolLiquidity(poolId);
        // if (this.verbose) {
        //     // this.log("poolData: ", poolData);
        //     const obj = {};
        //     Object.keys(poolData).forEach(k => {
        //         if (!isNaN(Number(k))) return;
        //         if (poolData[k]._isBigNumber) {
        //             obj[k] = (poolData[k]);
        //             return;
        //         }
        //         return obj[k] = poolData[k];
        //     });
        //     obj["baseLiquidity"] = fromWei(poolLiquidity.base);
        //     obj["quoteLiquidity"] = fromWei(poolLiquidity.quote);
        //     console.table({
        //         ...obj
        //     });
        // }
    }

    async expectPoolData(poolId, expectData: ExpectedPoolData) {
        console.group(`Expect Pool Data`);
        let { quoteLiquidity, baseLiquidity, netAssetValue, totalQuoteDeposited, poolPnL : pollPnLExpect, totalFC } = expectData;
        // check pool data
        this.log("before getPoolLiquidity ", poolId, expectData);
        await this.printPoolData(poolId)
        // const poolData = await this.getPoolData(poolId);

        console.groupEnd();
    }

    async expectDataInRange(_expect: number, _actual: number, _percentage: number): Promise<boolean> {
        if (_actual > 0) {
            return _expect >= _actual * (1 - _percentage) && _expect <= _actual * (1 + _percentage);
        }
        return _expect <= _actual * (1 - _percentage) && _expect >= _actual * (1 + _percentage);

    }

    async addLiquidityAndExpect(_baseAmount: StringOrNumber, _quoteAmount: StringOrNumber, expectData: ExpectAddLiquidityResult, opts: CallOptions = {}): Promise<number> {

        return 0;
    }

    async removeLiquidityThenExpect(tokenId: SNumber, expectResult: ExpectRemoveLiquidity, opts: CallOptions = {}) {
        console.group(`RemoveLiquidity`);
        console.groupEnd();
    }

    async  takeOrderThenExpect(expectPrice: StringOrNumber ,expectPool: ExpectedPoolData,  opts?: CallOptions, filledBase = 0, filledQuote =0 , orderId? : number) {

        console.group("Take order")
        const poolId = this.poolId(opts?.poolId);

        if (filledQuote != 0){

            // sell
            await this.takeOrder(expectPrice, 0, filledQuote, 1, orderId );
        }
        if (filledBase != 0) {
            // buy
            await this.takeOrder(expectPrice, filledBase,0 , 0, orderId);
        }

        const currentPip = await this.ins.getCurrentPip();





        await this.expectPoolData(poolId, expectPool);

    }




    // process test case by yaml
    async process(yaml) {
        let docs;
        try {
            docs = YAML.loadAll(yaml);
        } catch (e) {
            throw new Error(`Parse YAML error: ${e.message}. Please check the format.`);
        }
        this.log(`Total cases: ${docs.length}`);
        const processor = new YamlTestProcess(this);
        let i = 0;
        for (const steps of docs) {
            const startPrice = steps[0].getProp("price") || 1;
            await this.setPrice(startPrice);
            i++;
            console.group(`------------- Run case #${i}`);
            for (let step of steps) {
                const stepIdentityKey = Object.keys(step)[0];
                let stepFnName = step[stepIdentityKey];
                if(typeof stepFnName === 'object'){
                    step = stepFnName
                    stepFnName = Object.keys(stepFnName)[0];
                }
                this.log("stepFnName", stepFnName);
                if (!processor[stepFnName]) {
                    throw new Error(`${stepFnName} is not supported yet. Told your developer to implement it.`);
                }
                this.log("\x1b[33m%s\x1b[0m", `--- Processing ${stepIdentityKey} ${stepFnName}`);
                await processor[stepFnName](step);
            }
            console.groupEnd();
        }
    }

    async setPrice(price: number | string) {
    }



    async openLimitOrder(price: number, side: string, size: number, opts: CallOptions) {
        const pip = price2Pip(price)
        const orderSide = side == "Buy";
        const orderQuantity = toWei(size);

        // await this.ins.connect(opts.sender).openLimit(
        //     pip,
        //     orderQuantity,
        //     orderSide,
        //     opts.sender.address,
        //     this.quoteToken.address,
        //     this.baseToken.address
        // )
    }

    async openMarketOrder(price: number, side: string, size: number, opts: CallOptions) {
        const pip = price2Pip(price)
        const orderSide = side == "Buy";
        const orderQuantity = toWei(size);
        //
        // await this.pairManager.connect(opts.sender).openMarketMock(
        //     orderQuantity,
        //     orderSide,
        //     opts.sender.address,
        //     this.quoteToken.address,
        //     this.baseToken.address
        // )
    }


    async takeOrder(expectPrice: StringOrNumber, deltaBase: number, deltaQuote: number, side? : number, orderId? : number) {
        console.group("\x1b[5m", `Take Order`);
        console.log("start take");

        const currentPip = await this.ins.getCurrentPip();
        const currentPrice = pipToPrice(currentPip.toNumber());
        console.log("takerOrder  currentPrice, expectPrice: ",currentPrice,  expectPrice);
        let orderSide = side
        // if(typeof side == 'undefined'){
        //
        //   orderSide = expectPrice < 0 ?  SIDE.SELL : expectPrice >= currentPrice ? SIDE.BUY : SIDE.SELL;
        // }
        if (orderSide == SIDE.SELL) {
            console.log("takeOrder SELL");


        }else {
            console.log("takeOrder BUY");
        }

    }

    async getOrderBook(limit = 10) {
        const currentPip = await this.ins.getCurrentPip();
        console.log("currentPip: ", currentPip.toString());
        const bid = await this.ins.getLiquidityInPipRange(currentPip, limit, false).then(
            dt => dt[0].map(d => ({ pip: (d["pip"].toString()), liquidity: (d["liquidity"]).toString(), liquidityFormat: fromWei(d['liquidity']) }))
        );
        const ask = await this.ins.getLiquidityInPipRange(currentPip, limit, true).then(
            dt => dt[0].map(d => ({ pip: (d["pip"].toString()), liquidity: (d["liquidity"]).toString(), liquidityFormat: fromWei(d['liquidity']) }))
        );
        return { ask: ask.filter(obj => Number(obj.pip) != 0), bid: bid.filter(obj => Number(obj.pip) != 0) };
    }

    async getCurrentPrice() {
        return pipToPrice((await this.ins.getCurrentPip()).toString());
    }

    async getPoolData(pId?): Promise<PoolLiquidityInfo> {
        return undefined;
    }

    async getPoolBalance() {
        return this.getBaseQuoteAddress(this.ins.address);
    }



    async getBaseQuoteAddress(address) {
        const baseBalance = await this.baseToken.balanceOf(address);
        const quoteBalance = await this.quoteToken.balanceOf(address);
        return {
            baseBalance: fromWei(baseBalance),
            quoteBalance: fromWei(quoteBalance)
        };
    }

    poolId(argPid) {
        return argPid || this.defaultPoolId;
    }

    getSigner(opts) {
        return opts.signer || this.defaultSender;
    }

    log(...args) {
        if (this.verbose) {
            console.log('[TestLiquidityPoolHelper]: ', ...args);
        }
    }
}