import { ethers } from "hardhat";
import { expect } from "chai";
import { MockToken } from "../../typeChain";
import { deployContract, toWei } from "../utils/utils";
import { BigNumber } from "ethers";
import { deployMockToken } from "../utils/mock";
import {
  cancelLimitOrderAndVerify,
  checkLiquidityAtPip,
  createLimitOrder,
  createLimitOrderAndVerify,
  createLimitOrderAndVerifyAfter,
  createLimitOrderInPipRanges,
  createMarketOrderAndVerifyAfter,
  initilizeData,
  pairManager,
  shouldBuyMarketAndVerify,
  shouldReachPip,
  verifyLimitOrderDetail
} from "../helper";

// READ.ME
// Before you run this test
// Please ENSURE you have added event `Swap(msg.sender, size, sizeOut);`
// in function `_internalOpenMarketOrder()`

describe("Spot Manager", async function() {

  beforeEach(async () => {
    await initilizeData()
  });

  describe("single market buy limit sell", function() {
    it("should create limit order", async function() {
      await createLimitOrderAndVerify(105, 10, true);
      await createLimitOrderAndVerify(105, 15, true);
      await createLimitOrderAndVerify(100, 10, true);
      await createLimitOrderAndVerify(90, 10, true);
      await createLimitOrderAndVerify(110, 10, true);
    });

    it("should not fill any orders", async function() {
      // create limit order
      await createLimitOrderAndVerify(90, 10, true);
      await shouldBuyMarketAndVerify(8, 0, true, 0);
    });
    it("should fulfill buy market and partial fill limit sell order success", async function() {
      // sell limit size: 10 at 240
      // buy market 8
      const sellPip = 240;
      const orderId = await createLimitOrderAndVerify(sellPip, 10, false);
      // market buy
      await shouldBuyMarketAndVerify(8, 8, true, 8 * 240);

      // limit order should partial fill
      const orderDetail = await pairManager.getPendingOrderDetail(
        sellPip,
        Number(orderId).toString()
      );
      expect(orderDetail.partialFilled.toNumber()).eq(8);
      expect((await pairManager.getCurrentPip()).toNumber()).eq(240);
    });

    it("should partial fill market order fulfill limit sell order", async function() {
      // sell limit size: 10 at 240
      // buy market 12
      const sellPip = 240;
      const orderId = await createLimitOrderAndVerify(sellPip, 10, false);

      await shouldBuyMarketAndVerify(12, 10, true, 10 * 240);

      expect(await pairManager.hasLiquidity(sellPip)).eq(false);
      const orderDetail = await pairManager.getPendingOrderDetail(
        sellPip,
        Number(orderId).toString()
      );
      expect(orderDetail.partialFilled.toNumber()).eq(0);
      expect(orderDetail.isFilled).eq(true);
      expect((await pairManager.getCurrentPip()).toNumber()).eq(240);
    });
    it("should fulfill market and single limit order", async function() {
      // sell limit size: 10 at 240
      // buy market 10
      const sellPip = 240;
      const orderId = await createLimitOrderAndVerify(sellPip, 10, false);

      await shouldBuyMarketAndVerify(10, 10, true, 10 * 240);

      expect(await pairManager.hasLiquidity(sellPip)).eq(false);
      const orderDetail = await pairManager.getPendingOrderDetail(
        sellPip,
        Number(orderId).toString()
      );
      expect(orderDetail.partialFilled.toNumber()).eq(0);
      expect(orderDetail.isFilled).eq(true);
      expect((await pairManager.getCurrentPip()).toNumber()).eq(240);
    });

    describe("should fulfill market and multiple limit orders", async function() {
      const orderIds = {} as any;
      const pips = [240, 241, 242];
      beforeEach(async () => {
        // create 3 sell limit orders
        const sizes = [5, 3, 2];
        for (const i in pips) {
          orderIds[pips[i]] = await createLimitOrderAndVerify(
            pips[i],
            sizes[i],
            false
          );
        }
      });
      it("should fulfill market and multiple limit orders 1.1", async function() {
        // 3 limit orders at:
        // 240: 5
        // 241: 3
        // 242: 2
        // buy market: 5 -> out 5
        // price should reach 241. fulfill pip 240
        await shouldBuyMarketAndVerify(5, 5, true, 5 * 240);

        await verifyLimitOrderDetail({
          pip: 240,
          orderId: orderIds[240],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 241,
          orderId: orderIds[241],
          partialFilled: 0,
          isFilled: false
        });
        await verifyLimitOrderDetail({
          pip: 242,
          orderId: orderIds[242],
          partialFilled: 0,
          isFilled: false
        });
        await checkLiquidityAtPip(240, false);
        await checkLiquidityAtPip(241, true);
        await checkLiquidityAtPip(242, true);
        await shouldReachPip(240);
      });
      it("should fulfill market and multiple limit orders 1", async function() {
        // 3 limit orders at:
        // 240: 5
        // 241: 3
        // 242: 2
        // buy market: 8 -> out 8
        // price should reach 241. fulfill pip 240, 241
        await shouldBuyMarketAndVerify(8, 8, true, 5 * 240 + 3 * 241);

        await checkLiquidityAtPip(240, false);
        await checkLiquidityAtPip(241, false);
        await checkLiquidityAtPip(242, true);
        await verifyLimitOrderDetail({
          pip: 240,
          orderId: orderIds[240],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 241,
          orderId: orderIds[241],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 242,
          orderId: orderIds[242],
          partialFilled: 0,
          isFilled: false
        });
        await shouldReachPip(241);
      });

      it("should fulfill market and multiple limit orders 2", async function() {
        // 3 limit orders at:
        // 240: 5
        // 241: 3
        // 242: 2
        // buy market: 9 -> out 9
        // price should reach 241. fulfill pip 240, 241, partial fill 242

        // await shouldBuyMarketAndVerify(9, 9);
        await shouldBuyMarketAndVerify(9, 9, true, 5 * 240 + 3 * 241 + 242);
        await verifyLimitOrderDetail({
          pip: 240,
          orderId: orderIds[240],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 241,
          orderId: orderIds[241],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 242,
          orderId: orderIds[242],
          partialFilled: 1,
          isFilled: false
        });
        await checkLiquidityAtPip(240, false);
        await checkLiquidityAtPip(241, false);
        await checkLiquidityAtPip(242, true);
        await shouldReachPip(242);
      });
      it("should fulfill market and multiple limit orders 3", async function() {
        // 3 limit orders at:
        // 240: 5
        // 241: 3
        // 242: 2
        // buy market: 10 -> out 10
        // price should reach 241. fulfill pip 240, 241, 242
        await shouldBuyMarketAndVerify(10, 10, true, 5 * 240 + 3 * 241 + 2 * 242);
        // await shouldBuyMarketAndVerify(10, 10);
        await verifyLimitOrderDetail({
          pip: 240,
          orderId: orderIds[240],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 241,
          orderId: orderIds[241],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 242,
          orderId: orderIds[242],
          partialFilled: 0,
          isFilled: true
        });
        await checkLiquidityAtPip(240, false);
        await checkLiquidityAtPip(241, false);
        await checkLiquidityAtPip(242, false);
        await shouldReachPip(242);
      });
      it("should fulfill market and multiple limit orders 4", async function() {
        // 3 limit orders at:
        // 240: 5
        // 241: 3
        // 242: 2
        // buy market: 12 -> out 10, left: 2
        // price should reach 241. fulfill pip 240, 241, 242
        await shouldBuyMarketAndVerify(12, 10, true, 5 * 240 + 3 * 241 + 2 * 242);
        // await shouldBuyMarketAndVerify(12, 10);
        await verifyLimitOrderDetail({
          pip: 240,
          orderId: orderIds[240],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 241,
          orderId: orderIds[241],
          partialFilled: 0,
          isFilled: true
        });
        await verifyLimitOrderDetail({
          pip: 242,
          orderId: orderIds[242],
          partialFilled: 0,
          isFilled: true
        });
        await checkLiquidityAtPip(240, false);
        await checkLiquidityAtPip(241, false);
        await checkLiquidityAtPip(242, false);
        await shouldReachPip(242);
      });
    });
  });
  describe("multiple market buys and multiple sell limit orders", function() {
    it("scenario 1", async function() {
      const pips = [220, 222, 230];
      const pipSizes = [10, 15, 20];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 5,
        size: 5,
        pips,
        pipsHasLiquidity: [true, true, true],
        reachPip: 220,
        orders,
        partialFilledAmounts: [5, 0, 0],
        isFilledAmounts: [false, false, false],
        quoteAmount :5*220
      });
      const newOrderId = await createLimitOrderAndVerify(220, 5, false);
      // orders.push(newOrderId)
      console.log((await pairManager.tickPosition(220)).liquidity.toString());
      await createMarketOrderAndVerifyAfter({
        sizeOut: 5,
        size: 5,
        pips,
        pipsHasLiquidity: [true, true, true],
        reachPip: 220,
        orders,
        partialFilledAmounts: [10, 0, 0, 0],
        isFilledAmounts: [true, false, false, false],
        quoteAmount :5*220

      });
      const newLimitOrderId = await createLimitOrderAndVerify(220, 5, false);
      // @ts-ignore
      // orders.push(newLimitOrderId)
      await createMarketOrderAndVerifyAfter({
        sizeOut: 45,
        size: 50,
        pips,
        pipsHasLiquidity: [false, false, false],
        reachPip: 230,
        orders,
        partialFilledAmounts: [10, 0, 0, 0],
        isFilledAmounts: [true, true, true, true],
        quoteAmount :10*220+15*222+20*230

      });
    });
  });
  describe("single market sell limit buy orders", function() {
    it("should test 1", async function() {
      const pips = [100, 101, 102];
      const pipSizes = [10, 20, 30];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 5,
        size: 5,
        pips,
        pipsHasLiquidity: [true, true, true],
        reachPip: 102,
        orders,
        partialFilledAmounts: [0, 0, 5],
        isFilledAmounts: [false, false, false],
        isBuy: false,
        quoteAmount :5*102
      });
    });
    it("should test 2", async function() {
      const pips = [100, 101, 102];
      const pipSizes = [10, 20, 30];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 35,
        size: 35,
        pips,
        pipsHasLiquidity: [true, true, false],
        reachPip: 101,
        orders,
        partialFilledAmounts: [0, 5, 0],
        isFilledAmounts: [false, false, true],
        isBuy: false,
        quoteAmount : 30 * 102 + 5 * 101
      });
    });
    it("should test 3", async function() {
      const pips = [100, 101, 102];
      const pipSizes = [10, 20, 30];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 60,
        size: 60,
        pips,
        pipsHasLiquidity: [false, false, false],
        reachPip: 100,
        orders,
        partialFilledAmounts: [0, 0, 0],
        isFilledAmounts: [true, true, true],
        isBuy: false,
        quoteAmount : 30 * 102 + 20 * 101 + 10 * 100
      });
    });
    it("should test 4", async function() {
      const pips = [100, 101, 102];
      const pipSizes = [10, 20, 30];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 60,
        size: 65,
        pips,
        pipsHasLiquidity: [false, false, false],
        reachPip: 100,
        orders,
        partialFilledAmounts: [0, 0, 0],
        isFilledAmounts: [true, true, true],
        isBuy: false,
        quoteAmount :  30 * 102 + 20 * 101 + 10 * 100
      });
    });
  });
  describe("buy sell in multiple ranges", async function() {
    it("should cross buy market in multiple ranges limit orders", async function() {
      const pips = [250, 253, 254, 255, 256, 257, 258];
      const pipSizes = [10, 10, 10, 10, 10, 10, 10];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 60,
        size: 60,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, true],
        reachPip: 257,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, false],
        quoteAmount : 10 * (250+  253+  254+ 255+ 256+ 257)
      });
    });
    it("should cross sell market in multiple ranges limit orders", async function() {
      await createLimitOrderAndVerify(260, 10, false);
      await shouldBuyMarketAndVerify(10, 10, true, 10 * 260);
      await checkLiquidityAtPip(260, false);
      const pips = [258, 257, 256, 255, 254, 253, 252];
      const pipSizes = [10, 10, 10, 10, 10, 10, 10];
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true);
      await createMarketOrderAndVerifyAfter({
        sizeOut: 50,
        size: 50,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, true, true],
        reachPip: 254,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, false, false],
        isBuy: false,
        quoteAmount : 10 * (258 + 257+  256 + 255 +  254 )
      });
    });
  });
  describe("cancel limit order", async () => {
    it("should cancel buy limit order", async () => {
      await createLimitOrder(105, 20, true);
      await cancelLimitOrderAndVerify(105, 10, true, false, 0);
    });

    it("should cancel buy limit order partial filled", async () => {
      await cancelLimitOrderAndVerify(105, 20, true, true, 5);
    });

    it("cancel sell limit order", async () => {
      await createLimitOrder(250, 20, false);
      await cancelLimitOrderAndVerify(250, 10, false, false, 0);
    });

    it("should cancel sell limit order partial filled", async () => {
      await cancelLimitOrderAndVerify(250, 35, false, true, 5);
    });
  });

  describe("revert errors", async () => {
    it("VL_SHORT_PRICE_LESS_CURRENT_PRICE", async () => {
      await expect(createLimitOrder(450201, 20, false)).to.revertedWith("4");
    });
  });


  describe("open limit LONG higher than current price", async () => {



    it("should fill all pending limit order expect first LONG order then stop at the last order", async () => {
      const pips = [201, 203, 204, 205, 216, 217, 218]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, false)
      await createLimitOrderInPipRanges([200], [9], true)

      await createLimitOrderAndVerifyAfter({
        pip: 220,
        size: 28,
        sizeOut: 28,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false],
        reachPip: 218,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true]
      })
    })

    it("should fill all pending limit order include first SHORT order then stop at the last order ", async () => {
      const pips = [200, 201, 203, 204, 205, 216, 217, 218]
      const pipSizes = [8, 1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, false)
      console.log("before create limit order and verify")

      await createLimitOrderAndVerifyAfter({
        pip: 220,
        size: 36,
        sizeOut: 36,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false, false],
        reachPip: 218,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true, true],
        isBuy: true
      })
    })

    it("should fill all pending limit order than create a new pending order at the target pip", async () => {
      const pips = [201, 203, 204, 205, 216, 217, 218]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes)

      await createLimitOrderAndVerifyAfter({
        pip: 220,
        size: 30,
        sizeOut: 28,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false],
        reachPip: 220,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true],
        isBuy: true
      })
    })

    it("should fulfill size of limit order and partial filled last matched pip", async () => {
      const pips = [201, 203, 204, 205, 216, 217, 218]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes)
      console.log("before create limit order and verify")
      await createLimitOrderAndVerifyAfter({
        pip: 220,
        size: 12,
        sizeOut: 12,
        pips,
        pipsHasLiquidity: [false, false, false, false, true, true, true],
        reachPip: 216,
        orders,
        partialFilledAmounts: [0, 0, 0, 0, 2, 0, 0],
        isFilledAmounts: [true, true, true, true, false, false, false],
        isBuy: true
      })
    })

    it("should fulfill limit order size and fulfilled last matched pip", async () => {
      const pips = [201, 203, 204, 205, 216, 217, 218]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes)
      console.log("before create limit order and verify")
      await createLimitOrderAndVerifyAfter({
        pip: 220,
        size: 10,
        sizeOut: 10,
        pips,
        pipsHasLiquidity: [false, false, false, false, true, true, true],
        reachPip: 205,
        orders,
        partialFilledAmounts: [0, 0, 0, 0, 0, 0, 0],
        isFilledAmounts: [true, true, true, true, false, false, false],
        isBuy: true
      })
    })

    it("should create a new pending order and change price to target pip", async () => {
      await createLimitOrderAndVerifyAfter({
        pip: 230,
        size: 30,
        sizeOut: 0,
        pips: [],
        pipsHasLiquidity: [],
        reachPip: 230,
      })
    })
  })

  describe("open limit SHORT lower than current price", async () => {
    it("should fill all pending limit order expect first SHORT order then stop at the last order", async () => {
      const pips = [199, 197, 196, 195, 184, 183, 182]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true)
      await createLimitOrderInPipRanges([200], [9], false)


      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 28,
        sizeOut: 28,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false],
        reachPip: 182,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true],
        isBuy: false
      })
    })

    it("should fill all pending limit order include first LONG order then stop at the last order", async () => {
      const pips = [200, 199, 197, 196, 195, 184, 183, 182]
      const pipSizes = [9, 1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true)
      console.log("before create limit order and verify")

      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 37,
        sizeOut: 37,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false, false],
        reachPip: 182,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true, true],
        isBuy: false
      })
    })

    it("should fill all pending limit order than create a new pending order at the target pip", async () => {
      const pips = [199, 197, 196, 195, 184, 183, 182]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true)

      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 30,
        sizeOut: 28,
        pips,
        pipsHasLiquidity: [false, false, false, false, false, false, false],
        reachPip: 180,
        orders,
        partialFilledAmounts: [...pips].fill(0),
        isFilledAmounts: [true, true, true, true, true, true, true],
        isBuy: false
      })
    })

    it("should fulfill size of limit order and partial filled last matched pip", async () => {
      const pips = [199, 197, 196, 195, 184, 183, 182]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true)
      console.log("before create limit order and verify")
      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 12,
        sizeOut: 12,
        pips,
        pipsHasLiquidity: [false, false, false, false, true, true, true],
        reachPip: 184,
        orders,
        partialFilledAmounts: [0, 0, 0, 0, 2, 0, 0],
        isFilledAmounts: [true, true, true, true, false, false, false],
        isBuy: false
      })
    })

    it("should fulfill limit order size and fulfilled last matched pip", async () => {
      const pips = [199, 197, 196, 195, 184, 183, 182]
      const pipSizes = [1, 2, 3, 4, 5, 6, 7]
      const orders = await createLimitOrderInPipRanges(pips, pipSizes, true)
      console.log("before create limit order and verify")
      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 10,
        sizeOut: 10,
        pips,
        pipsHasLiquidity: [false, false, false, false, true, true, true],
        reachPip: 195,
        orders,
        partialFilledAmounts: [0, 0, 0, 0, 0, 0, 0],
        isFilledAmounts: [true, true, true, true, false, false, false],
        isBuy: false
      })
    })

    it("should create a new pending order and change price to target pip", async () => {
      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 30,
        sizeOut: 0,
        pips: [],
        pipsHasLiquidity: [],
        reachPip: 180,
        isBuy: false
      })
    })

    it("should create many pending orders when create and change price to highest target pip", async () => {
      await createLimitOrderAndVerifyAfter({
        pip: 180,
        size: 30,
        sizeOut: 0,
        pips: [],
        pipsHasLiquidity: [],
        reachPip: 180,
        isBuy: false
      })

      await createLimitOrderAndVerifyAfter({
        pip: 170,
        size: 30,
        sizeOut: 0,
        pips: [180],
        pipsHasLiquidity: [true],
        reachPip: 170,
        isBuy: false
      })
    })
  })

});



describe("estimate amount", async ()=>{

  let quoteAsset: MockToken, baseAsset: MockToken, pairManager: PairManager;

  const [deployer] = await ethers.getSigners();

  beforeEach(async ()=>{

    // deploy mock token
    quoteAsset = await deployMockToken("Quote Asset");
    baseAsset = await deployMockToken("Base Asset");

    // const [deployer] = await ethers.getSigners();

    pairManager = await deployContract("PairManager", deployer);
    await pairManager.initializeFactory(
      quoteAsset.address,
      baseAsset.address,
      deployer.address,
      BigNumber.from(10000),
      BigNumber.from(10000),
      BigNumber.from(1800),
      BigNumber.from(100000),
      BigNumber.from(0),
      baseAsset.address,
      deployer.address
    );

  })


})
