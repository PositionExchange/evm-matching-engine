import {LiquidityMathTest} from "../../typeChain";
import {ethers} from "hardhat";
import {deployContract, getAccount, toWei} from "../utils/utils";
import { expect } from "chai";


describe('Test-LiquidityMath', () => {


    let liquidityMathTest : LiquidityMathTest;
    let caller: any



    beforeEach(async () => {
        [caller] = await getAccount()

        liquidityMathTest = await deployContract("LiquidityMathTest", caller);

    })

    describe('calculate-base-real', function ()  {
        it('should calculate ok', async () => {
            const result = await liquidityMathTest.calculateBaseReal(100000, toWei(20), 60000);
            expect(result).to.equal("88729833462074168851");
        })

    })


    describe('calculate-quote-real', function ()  {
        it('should quote calculate ok', async () => {
            const result = await liquidityMathTest.calculateQuoteReal(10000, toWei(20), 60000);
            console.log(result.toString())
            expect(result).to.equal("33797958971132712392");
        })

    })

    describe('calculateBaseWithPriceWhenSell', function ()  {
        it('should quote calculate ok', async () => {
            const result = await liquidityMathTest.calculateBaseWithPriceWhenSell(60000, toWei(5595.8), 80000);
            console.log(result.toString())
        })

    })


    describe('calculateQuoteWithPriceWhenSell', function ()  {
        it('should quote calculate ok', async () => {
            const result = await liquidityMathTest.calculateQuoteWithPriceWhenSell(60000, toWei(5595.8), 80000);
            console.log(result.toString())
        })

    })

    describe('calculateBaseWithPriceWhenBuy', function ()  {
        it('should quote calculate ok', async () => {
            const result = await liquidityMathTest.calculateBaseWithPriceWhenBuy(80000, toWei(5595.8), 60000);
            console.log(result.toString())
        })

    })

    describe('calculateQuoteWithPriceWhenBuy', function ()  {
        it('should quote calculate ok', async () => {
            const result = await liquidityMathTest.calculateQuoteWithPriceWhenBuy(80000, toWei(5595.8), 60000);
            console.log(result.toString())
        })

    })


})
