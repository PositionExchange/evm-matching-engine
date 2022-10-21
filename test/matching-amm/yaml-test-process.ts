import {expect} from "chai";
import {TestMatchingAmm} from "./test-matching-amm";
import {getAccount, SIDE} from "../utils/utils";

export class YamlTestProcess {
    testHelper: TestMatchingAmm;


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

        const indexPipRange = action.getProp("IndexPipRange")
        const baseVirtual = action.getProp("BaseVirtual")
        const quoteVirtual = action.getProp("QuoteVirtual")
        const liquidity = action.getProp("Liquidity")


        return {
            id,
            asset,
            side,
            quantity,
            price,
            indexPipRange,
            baseVirtual,
            quoteVirtual,
            liquidity
        }
    }

    extractPending(expect) {

        const orderId = expect.getProp("orderId");
        const size = expect.getProp("size");
        const side = expect.getProp("side");
        const price = expect.getProp("price");

        return {
            orderId,
            size,
            side,
            price
        }

    }
    extractPool(expect){

        const liquidity = expect.getProp("Liquidity")
        const baseVirtual = expect.getProp("BaseVirtual")
        const quoteVirtual = expect.getProp("QuoteVirtual")

        const baseReal = expect.getProp("BaseReal")
        const quoteReal = expect.getProp("QuoteReal")


        const indexPipRange = expect.getProp("IndexPipRange")

        const maxPip = expect.getProp("MaxPip")
        const minPip = expect.getProp("MinPip")

        const feeGrowthBase = expect.getProp("FeeGrowthBase")
        const feeGrowthQuote = expect.getProp("FeeGrowthQuote")

        return{
            liquidity,
            baseVirtual,
            quoteVirtual,
            baseReal,
            quoteReal,
            indexPipRange,
            maxPip,
            minPip,
            feeGrowthBase,
            feeGrowthQuote
        }
    }


    async expectTest(expectData) {


        const expectPool= expectData.getProp("Pool");
        const expectPendingOrder = expectData.getProp("PendingOrder");


        if (expectPendingOrder) {
            console.log("[IT] PendingOrder");
            const extract = this.extractPending(expectPendingOrder)
            console.log("extract: ", extract);
            await this.testHelper.expectPending(extract.orderId, extract.price, extract.side, extract.size);
        }

        if (expectPool) {
            await this.testHelper.expectPool(expectPool)

        }
    }

    async SetCurrentPrice(stepData) {
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.addLiquidity(action.baseVirtual, action.quoteVirtual, action.indexPipRange)}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }

    async AddLiquidity(stepData) {
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.addLiquidity(action.baseVirtual, action.quoteVirtual, action.indexPipRange)}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }

    log(...args){
        console.log(`[YamlTestCaseProcess]: `, ...args)
    }

    async RemoveLiquidity(stepData) {
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.removeLiquidity( action.indexPipRange, action.liquidity)}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }



    async OpenLimit(stepData) {
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.openLimitOrder( action.price, action.side, action.quantity, action.id)}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }
    async OpenMarket(stepData) {

        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.openMarketOrder(  action.side, action.quantity, action.asset)}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }
}
