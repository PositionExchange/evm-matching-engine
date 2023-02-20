import {expect, use} from "chai";
import YAML from "js-yaml";
import {MatchingEngineAMM, MockMatchingEngineAMM, MockToken} from "../../typeChain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {deployContract, expectRevert, fromWei, getAccount, SIDE, toWei} from "../utils/utils";
import {BigNumber, BigNumberish, ethers} from "ethers";
import {YamlTestProcess} from "./yaml-test-process";
import Decimal from "decimal.js";
import {deployMockToken} from "../utils/mock";
import {EventFragment} from "@ethersproject/abi";
import {PromiseOrValue} from "../../typeChain/common";

// import {waffle} from "hardhat";
// const {solidity} = waffle
// use(solidity);

export type SNumber = number | string | BigNumber
export type StringOrNumber = string | number

export interface CallOptions {
    sender?: SignerWithAddress;
    poolId?: string;
    revert?: any;

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
    Liquidity?: SNumber;
    BaseVirtual?: SNumber;
    QuoteVirtual?: SNumber;
    BaseReal?: SNumber;
    QuoteReal?: SNumber;
    IndexPipRange?: SNumber;
    MaxPip?: SNumber;
    MinPip?: SNumber;
    FeeGrowthBase?: SNumber;
    FeeGrowthQuote?: SNumber;
    K?: SNumber;
}

export interface ExpectAddLiquidityResult extends ExpectedPoolData {
    userDebt?: StringOrNumber;
}

export const BASIS_POINT = 10000;


// function pipToPrice(currentPip: StringOrNumber) {
//     return Number(currentPip) / BASIS_POINT;
// }


function fromWeiAndFormat(n, decimal = 6): number {
    return new Decimal(fromWei(n).toString()).toDP(decimal).toNumber()
}

function sqrt(n: number): number {

    return Math.sqrt(n);
}

function roundNumber(n, decimal = 6) {
    return new Decimal((n).toString()).toDP(decimal).toNumber()
}

// useWBNB: 0 is not use, 1 is WBNB Quote, 2 is WBNB Base
export async function deployAndCreateRouterHelper(pipRange = 30_000, basisPoint = 10_000) {
    let matching: MockMatchingEngineAMM
    let testHelper: TestMatchingAmm;

    let mockToken : MockToken


    let users: any[] = [];
    users = await getAccount() as unknown as any[];
    const deployer = users[0];
    matching = await deployContract("MockMatchingEngineAMM", deployer);
    mockToken = await deployContract("MockToken",deployer, "MockToken", "MT")
    await matching.setCounterParty();

    await matching.initialize(
        {
            quoteAsset: mockToken.address,
            baseAsset: mockToken.address,
            basisPoint: basisPoint,
            maxFindingWordsIndex: 1000,
            initialPip: 100000,
            pipRange: pipRange,
            tickSpace: 1,
            positionLiquidity: deployer.address,
            spotHouse: deployer.address,
            router : deployer.address
        })

    console.log("basisPoint :", (await matching.basisPoint()).toString())

    testHelper = new TestMatchingAmm(matching, deployer, {
        users
    });
    return testHelper;
}


export class TestMatchingAmm {
    ins: MockMatchingEngineAMM;
    defaultPoolId: string;
    defaultSender: SignerWithAddress;
    nftTokenId: number = 1000000;
    baseToken: MockToken;
    quoteToken: MockToken;
    // @notice fee in %
    spotFee: number;
    verbose = true;
    users: SignerWithAddress[]


    constructor(_ins: MockMatchingEngineAMM, _defaultSender: SignerWithAddress, opts: {
        users: SignerWithAddress[]
    }) {
        this.ins = _ins;
        this.defaultSender = _defaultSender;
        this.users = opts.users;
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


    expectDataInRange(_expect: number, _actual: number, _percentage: number): boolean {
        if (_actual > 0) {
            return _expect >= _actual * (1 - _percentage) && _expect <= _actual * (1 + _percentage);
        }
        return _expect <= _actual * (1 - _percentage) && _expect >= _actual * (1 + _percentage);

    }

    async setCurrentPrice(price: StringOrNumber) {
        await this.ins.setCurrentPip(price);
    }

    async addLiquidity(baseVirtual: StringOrNumber, quoteVirtual: StringOrNumber, indexPip: StringOrNumber, opts: CallOptions = {}): Promise<number> {

        console.group(`AddLiquidity`);
        // console.l

        await this.ins.addLiquidity({
            baseAmount: toWei(baseVirtual),
            quoteAmount: toWei(quoteVirtual),
            indexedPipRange: indexPip
        });
        return 0;
    }


    async removeLiquidity(indexPip: SNumber, liquidity: SNumber, opts: CallOptions = {}) {
        console.group(`RemoveLiquidity`);

        await this.ins.removeLiquidity({
            indexedPipRange: indexPip,
            liquidity: toWei(liquidity),
            feeGrowthBase: 0,
            feeGrowthQuote: 0
        });

        console.groupEnd();
    }


    async expectPool(expectData: ExpectedPoolData) {

        const poolData = await this.ins.liquidityInfo(expectData.IndexPipRange);
        //
        console.log("[expectPool] Expected pool max pip: ", sqrt(Number(expectData.MaxPip)) * 10 ** 9, Number(poolData.sqrtMaxPip));
        console.log("[expectPool] Expected pool baseReal: ", Number(expectData.BaseReal), fromWeiAndFormat(poolData.baseReal));
        console.log("[expectPool] Expected pool quoteReal: ", Number(expectData.QuoteReal), fromWeiAndFormat(poolData.quoteReal));
        console.log("[expectPool] Expected pool K: ", sqrt(Number(expectData.K)), fromWeiAndFormat(poolData.sqrtK));
        console.log("[expectPool] Expected pool Liquidity: ", Number(expectData.Liquidity), fromWeiAndFormat(poolData.sqrtK));

        if (expectData.MaxPip !== undefined) expect(this.expectDataInRange(Math.round(sqrt(Number(expectData.MaxPip)) * 10 ** 12), Number(poolData.sqrtMaxPip), 0.01)).to.equal(true, "MaxPip");
        if (expectData.MinPip !== undefined) expect(this.expectDataInRange(Math.round(sqrt(Number(expectData.MinPip)) * 10 ** 12), Number(poolData.sqrtMinPip), 0.01)).to.equal(true, "MinPip");
        if (expectData.FeeGrowthBase !== undefined) expect(this.expectDataInRange(Number(expectData.FeeGrowthBase), fromWeiAndFormat(poolData.feeGrowthBase), 0.01)).to.equal(true, "FeeGrowthBase");
        if (expectData.FeeGrowthQuote !== undefined) expect(this.expectDataInRange(Number(expectData.FeeGrowthQuote), fromWeiAndFormat(poolData.feeGrowthQuote), 0.01)).to.equal(true, "FeeGrowthQuote")


        if (expectData.BaseReal !== undefined) expect(this.expectDataInRange(Number(expectData.BaseReal), fromWeiAndFormat(poolData.baseReal), 0.01)).to.equal(true, "BaseReal");
        if (expectData.QuoteReal !== undefined) expect(this.expectDataInRange(Number(expectData.QuoteReal), fromWeiAndFormat(poolData.quoteReal), 0.01)).to.equal(true, "QuoteReal");
        if (expectData.K !== undefined) expect(this.expectDataInRange(sqrt(Number(expectData.K)), fromWeiAndFormat(poolData.sqrtK), 0.01)).to.equal(true, "K");
        if (expectData.Liquidity !== undefined) expect(this.expectDataInRange(Number(expectData.Liquidity), fromWeiAndFormat(poolData.sqrtK), 0.01)).to.equal(true, "Liquidity");

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
            console.group(`------------- Run case #${i}`);
            for (let step of steps) {
                const stepIdentityKey = Object.keys(step)[0];
                let stepFnName = step[stepIdentityKey];
                if (typeof stepFnName === 'object') {
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
            i++;
            console.groupEnd();
        }
    }

    async setPrice(price: number | string) {
    }


    async openLimitOrder(pip: number, side: number, size: number, id: number, opts?: CallOptions) {
        // const pip = price2Pip(price)
        const a = await this.ins.singleSlot()

        console.log("a", a.pip.toString());
        const isBuy = side == 0;
        const orderQuantity = toWei(size);

        console.log("pip, isBuy, orderQuantity: ", pip, isBuy, orderQuantity);

        if ( opts.revert  !== undefined) {

            await expectRevert(this.ins.openLimit(pip, orderQuantity, isBuy, this.users[id].address, 0, 0), opts.revert.toString());

        }else {
            await this.ins.openLimit(pip, orderQuantity, isBuy, this.users[id].address, 0, 0);

        }

    }

    async openMarketOrder(side: number, size: number, asset: String, opts?: CallOptions) {
        const isBuy = side == 0;
        const orderQuantity = toWei(size);

        const a = await this.ins.singleSlot();
        console.log("isFullBuy: ", a.isFullBuy);


        if (opts.revert !== undefined) {

            if (asset === "base") {
                console.log("opts.revert.toString(): ", opts?.revert.toString());
                await expectRevert(this.ins.openMarket(orderQuantity, isBuy, this.users[0].address, 0), opts.revert.toString());

            } else if (asset === "quote") {
                await expectRevert(this.ins.openMarketWithQuoteAsset(orderQuantity, isBuy, this.users[0].address, 0), opts.revert.toString());

            }

        } else {
            if (asset === "base") {
                const tx = await this.ins.openMarket(orderQuantity, isBuy, this.users[0].address, 0);
                const receipt = await tx.wait();
                const gasUsed = receipt.gasUsed.toString()
                console.log(`GasUes OpenMarket \x1b[33m  ${gasUsed} \x1b[0m`);


            } else if (asset === "quote") {
                const tx = await this.ins.openMarketWithQuoteAsset(orderQuantity, isBuy, this.users[0].address, 0);
                const receipt = await tx.wait();
                const gasUsed = receipt.gasUsed.toString()
                console.log(`GasUes OpenMarket \x1b[33m  ${gasUsed} \x1b[0m`);

            }
        }
    }

    async expectPending(orderId: number, price: number, side: any, _size: number) {


        const {isFilled, isBuy, size} = await this.ins
            .getPendingOrderDetail(price, orderId)

        expect(this.expectDataInRange(fromWeiAndFormat(size), Number(_size), 0.01))
            .to
            .eq(true, `pending base is not correct, expect ${fromWei(size)} in range of to ${_size}`);

        await expect(side == SIDE.BUY).to.eq(isBuy);

    }

    async cancelLimitOrder(pip: number, orderId: SNumber, idSender : number, opts?: CallOptions) {

        console.group(`CancelLimitOrder`);
        await  this.ins.cancelLimitOrder( pip, orderId);
        console.groupEnd();
    }

    async getOrderBook(limit = 10) {
        const currentPip = await this.ins.getCurrentPip();
        console.log("currentPip: ", currentPip.toString());
        const bid = await this.ins.getLiquidityInPipRange(currentPip, limit, false).then(
            dt => dt[0].map(d => ({
                pip: (d["pip"].toString()),
                liquidity: (d["liquidity"]).toString(),
                liquidityFormat: fromWei(d['liquidity'])
            }))
        );
        const ask = await this.ins.getLiquidityInPipRange(currentPip, limit, true).then(
            dt => dt[0].map(d => ({
                pip: (d["pip"].toString()),
                liquidity: (d["liquidity"]).toString(),
                liquidityFormat: fromWei(d['liquidity'])
            }))
        );
        return {ask: ask.filter(obj => Number(obj.pip) != 0), bid: bid.filter(obj => Number(obj.pip) != 0)};
    }

    // async getCurrentPrice() {
    //     return pipToPrice((await this.ins.getCurrentPip()).toString());
    // }

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
