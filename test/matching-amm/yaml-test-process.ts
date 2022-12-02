import {expect, use} from "chai";
import {TestMatchingAmm} from "./test-matching-amm";
import {getAccount, SIDE} from "../utils/utils";
//
// import {waffle} from "hardhat";
// const {solidity} = waffle
// use(solidity);

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
        const revert = action.getProp("Revert")
        const orderId = action.getProp("OrderId")



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
            revert,
            orderId
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
        const k = expect.getProp("K")

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
            feeGrowthQuote,
            k
        }
    }


    async expectTest(expectData) {


        const expectPool= expectData.getProp("Pool");
        const expectPendingOrder = expectData.getProp("PendingOrder");


        if (expectPendingOrder) {
            console.log("[IT] PendingOrder");
            const extract = this.extractPending(expectPendingOrder)
            await this.testHelper.expectPending(extract.orderId, extract.price, extract.side, extract.size);
        }

        if (expectPool) {
            const extract = this.extractPool(expectPool)

            await this.testHelper.expectPool({
                Liquidity: extract.liquidity,
                BaseVirtual: extract.baseVirtual,
                QuoteVirtual: extract.quoteVirtual,
                BaseReal: extract.baseReal,
                QuoteReal: extract.quoteReal,
                IndexPipRange: extract.indexPipRange,
                MaxPip: extract.maxPip,
                MinPip: extract.minPip,
                FeeGrowthBase: extract.feeGrowthBase,
                FeeGrowthQuote: extract.feeGrowthQuote,
                K : extract.k
            })

        }
    }

    async SetCurrentPrice(stepData) {
        console.log("[IT] SetCurrentPrice: ",stepData );
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.setCurrentPrice(action.price)}
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


    async CancelLimitOrder(stepData) {

        const action = this.extractAction(stepData.getProp("Action"));
        console.log("action.price, action.orderId, action.id", action.price, action.orderId, action.id)
        if (action) { await this.testHelper.cancelLimitOrder(action.price, action.orderId, action.id )}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }




    async OpenLimit(stepData) {

        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.openLimitOrder( action.price, action.side, action.quantity, action.id, {revert : action.revert} )}
        const expectData = stepData.getProp("Expect");
        if (expectData) await this.expectTest(expectData);
    }
    async OpenMarket(stepData) {
        const action = this.extractAction(stepData.getProp("Action"));
        if (action) { await this.testHelper.openMarketOrder(  action.side, action.quantity, action.asset, {revert : action.revert})}

        if (action.revert === undefined){
            const expectData = stepData.getProp("Expect");
            if (expectData) await this.expectTest(expectData);
        }

    }
    async Expect(stepData) {
        if (stepData) await this.expectTest(stepData);
    }
}
