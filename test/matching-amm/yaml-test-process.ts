import {expect} from "chai";
import {TestMatchingAmm} from "./test-matching-amm";
import {getAccount, SIDE} from "../utils/utils";

export class YamlTestProcess {
    testHelper: TestMatchingAmm;

    nftStore: Map<string, number> = new Map<string, number>();

    constructor(testHelper: TestMatchingAmm) {
        this.testHelper = testHelper;
    }

    extractAction(action)
    {
        const id = action.getProp("Id");
        const asset = action.getProp("Asset")
        const side = (action.getProp("Side")) == 0 ? SIDE.BUY : SIDE.SELL
        const quantity = action.getProp("Quantity")
        const price = action.getProp("Price")
        const orderId = action.getProp("OrderId")

        const indexPipRange = action.getProp("IndexPipRange")
        const baseVirtual = action.getProp("BaseVirtual")
        const quoteVirtual = action.getProp("QuoteVirtual")
        const liquidity = action.getProp("Liquidity")
        const baseReal = action.getProp("BaseReal")
        const quoteReal = action.getProp("quoteReal")

        const maxPip = action.getProp("MaxPip")
        const minPip = action.getProp("MinPip")
        const feeGrowthBase = action.getProp("FeeGrowthBase")
        const feeGrowthQuote = action.getProp("FeeGrowthQuote")




        // const path = action.getProp("path");
        // const amount = action.getProp("amount")
        // const to  = action.getProp("to");
        // const revert = action.getProp("revert");
        // const useBNB = action.getProp("useBNB");


        return {
            id,
            asset,
            side,
            quantity,
            price,
            indexPipRange,
            baseVirtual,
            quoteVirtual,
            liquidity,
            baseReal,
            quoteReal,
            maxPip,
            minPip,
            feeGrowthBase,
            feeGrowthQuote,




        }
    }

    // TODO implement add liquidity
    async AddLiquidity(stepData) {
    }

    log(...args){
        console.log(`[YamlTestCaseProcess]: `, ...args)
    }

    // TODO implement remove liquidity
    async RemoveLiquidity(stepData) {

    }



    async LimitOrder(stepData) {

    }
    async TakeOrder(stepData){
        const price = stepData.getProp("Price") || stepData.getProp("ChangePrice");
        const filledQuote = stepData.getProp("FilledQuote");
        const filledBase = stepData.getProp("FilledBase");
        const poolExpect = stepData.getProp("pool");
        const orderId = stepData.getProp("OrderId") || 0;

        await this.testHelper.takeOrderThenExpect(price, this.extractPoolExpectData(poolExpect), undefined, filledBase, filledQuote, orderId );

    }

    async OpenLimit(stepData) {
        // this.log("stepData", stepData)
        //
        // const price = stepData.getProp("price")
        // const side = stepData.getProp("side")
        // const size = stepData.getProp("size")
        // const userId = stepData.getProp("userId")
        const accounts = await getAccount();
        const signer = accounts[0];

        const orders = stepData.getProp("Orders");


        const order = orders[0];

        const price = order[0];
        const size = order[1];
        const side = order[2] == 0 ? "Buy" : "Sell";


        await this.testHelper.openLimitOrder(
            price,
            side,
            size,
            {
                // @ts-ignore
                sender: signer
            })
    }

    async OpenMarket(stepData) {

        const accounts = await getAccount();
        const signer = accounts[0];

        const orders = stepData.getProp("Orders");


        const order = orders[0];

        const price = order[0];
        const size = order[1];
        const side = order[2] == 0 ? "Buy" : "Sell";


        await this.testHelper["openMarketOrder(address,uint8,uint256)"](
            price,
            side,
            size,
            {
                // @ts-ignore
                sender: signer
            })

    }


    extractPoolExpectData(poolExpect) {
        console.log("poolExpect: ", poolExpect);
        const poolQuote = poolExpect.getProp("Quote");
        const poolBase = poolExpect.getProp("Base");
        const netAssetValue = poolExpect.getProp("NetAssetValue");
        const totalDepositQuote = poolExpect.getProp("TotalDepositQuote");
        const poolPnL = poolExpect.getProp("pnl");
        const totalFC = poolExpect.getProp("TotalFC")

        return {
            quoteLiquidity: poolQuote,
            baseLiquidity: poolBase,
            netAssetValue,
            totalQuoteDeposited: totalDepositQuote,
            poolPnL,
            totalFC
        };
    }
}
