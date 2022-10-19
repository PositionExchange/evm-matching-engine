import {LiquidityMathTest} from "../../typeChain";
import {ethers} from "hardhat";
import {deployContract} from "../utils/utils";


describe('Test-LiquidityMath', async () => {


    let liquidityMathTest : LiquidityMathTest;
    const [deployer] = await ethers.getSigners();


    beforeEach(async () => {
        liquidityMathTest = await deployContract("LiquidityMathTest", deployer);
    })


})
