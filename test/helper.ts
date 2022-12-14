import { MockToken, MatchingEngineAMM } from "../typeChain";
import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployMockToken } from "./utils/mock";
import { deployContract } from "./utils/utils";

export let quoteAsset: MockToken, baseAsset: MockToken, pairManager: MatchingEngineAMM;

interface CreateLimitOrderAndVerifyAfterArg {
  pip: number;
  size: number;
  sizeOut: number
  pips: number[]
  pipsHasLiquidity: boolean[]
  reachPip: number
  orders?: number[][]
  partialFilledAmounts?: number[]
  isFilledAmounts?: boolean[],
  isBuy?: boolean
}

const interfaceEvent = new ethers.utils.Interface(["event MarketFilled(bool isBuy, uint256 indexed amount, uint128 toPip, uint256 startPip, uint128 remainingLiquidity, uint64 filledIndex)"]);


export const shouldOpenLimitAndVerify = async function (pip: number, size: number, expectOut: number, isBuy: boolean = true) {
  const [caller] = await ethers.getSigners()
  const tx = await pairManager.openLimit(pip, size, isBuy, caller.address,0, 0)
  const receipt = await ethers.provider.getTransactionReceipt(tx.hash)

  const interfaceEvent = new ethers.utils.Interface(["event MarketFilled(bool isBuy, uint256 indexed amount, uint128 toPip, uint256 startPip, uint128 remainingLiquidity, uint64 filledIndex)"]);

  const data = receipt.logs[1].data
  const topics = receipt.logs[1].topics
  if (expectOut != 0) {
    const event = interfaceEvent.decodeEventLog("MarketFilled", data, topics)
    expect(event.isBuy).to.equal(isBuy)
    expect(event.amount).to.equal(expectOut)
  }
}
export const checkLiquidityAmountAtPip = async function (pip: number, liquidity: number) {
  const liquidityAmount = await pairManager.getLiquidityInPipRange(BigNumber.from(pip), 10, true)
  await expect(Number(liquidityAmount[0][0].liquidity)).eq(Number(liquidity))
}

export async function createLimitOrderAndVerifyAfter(
  {
    pip,
    size,
    sizeOut,
    pips,
    pipsHasLiquidity,
    reachPip,
    orders,
    partialFilledAmounts,
    isFilledAmounts,
    isBuy = true
  }: CreateLimitOrderAndVerifyAfterArg
) {
  console.log("before open limit and verify")
  await shouldOpenLimitAndVerify(pip, size, sizeOut, isBuy)
  console.log("before check liquidity at pip")
  for (let i in pipsHasLiquidity) {
    await checkLiquidityAtPip(pips[i], pipsHasLiquidity[i])
  }
  console.log("before check liquidity amount at pip")
  if (reachPip == pip) {
    await checkLiquidityAmountAtPip(pip, size - sizeOut)
  }
  if (orders && partialFilledAmounts && isFilledAmounts && orders.length > 0)
    console.log("before verify limit order detail")
  for(let orderIndex in orders){
    await verifyLimitOrderDetail({
      pip: orders[orderIndex][0],
      orderId: orders[orderIndex][1],
      partialFilled: partialFilledAmounts[orderIndex],
      isFilled: isFilledAmounts[orderIndex],
    })
  }
  console.log("before check reach pip")
  await shouldReachPip(reachPip)
}

export async function createLimitOrder(pip: number, size: number, isBuy: boolean) {
  const [caller] = await ethers.getSigners();

  return pairManager.openLimit(pip, size, isBuy, caller.address,0,0);
}

export async function cancelLimitOrder(pip: number, orderId: number) {
  return pairManager.cancelLimitOrder(pip, orderId);
}

export async function createLimitOrderAndVerify(
  pip: number,
  size: number,
  isBuy: boolean
) {
  const { liquidity: liquidityBefore } = await pairManager.tickPosition(pip);
  const pipPositionData = await pairManager.tickPosition(pip);
  const orderId = pipPositionData.currentIndex.add(1);
  await createLimitOrder(pip, size, isBuy);
  console.log(
    `Create limit order ${isBuy ? "BUY" : "SELL"}`,
    orderId.toNumber(),
    `SIZE: ${size} at ${pip}`
  );
  const hasLiquidity = await pairManager.hasLiquidity(pip);
  expect(hasLiquidity).eq(true, `Pip #${pip}`);
  const { liquidity } = await pairManager.tickPosition(pip);
  expect(liquidity.sub(liquidityBefore).toNumber()).eq(size);
  const orderDetail = await pairManager.getPendingOrderDetail(
    pip,
    orderId.toNumber()
  );
  expect(orderDetail.size.toNumber(), "size not match").eq(size);
  return orderId.toNumber();
}

export async function cancelLimitOrderAndVerify(
  pip: number,
  size: number,
  isBuy: boolean,
  isOpenMarket: boolean = false,
  sizeMarket: number
) {
  const orderId = await createLimitOrderAndVerify(pip, size, isBuy);
  console.log("orderId ", orderId);
  const { liquidity: liquidityBefore } = await pairManager.tickPosition(pip);
  console.log("liquidity before ", liquidityBefore.toString());

  // for test partial filled
  if (isOpenMarket) {
    await marketBuy(sizeMarket, !isBuy);
  }

  await cancelLimitOrder(pip, orderId);
  console.log(
    `Cancel limit order ${isBuy ? "BUY" : "SELL"}`,
    orderId,
    `SIZE: ${size} at ${pip}`
  );

  const { liquidity } = await pairManager.tickPosition(pip);
  console.log("liquidity after ", liquidity.toString());

  const hasLiquidity = await pairManager.hasLiquidity(pip);
  expect(hasLiquidity).eq(liquidity.toNumber() > 0, `Pip #${pip}`);
  expect(liquidityBefore.sub(liquidity).toNumber()).eq(size);
}

export async function marketBuy(size: number, isBuy: boolean = true) {
  const [caller] = await ethers.getSigners();
  return pairManager.openMarket(size, isBuy,caller.address,0 );
}

export const shouldBuyMarketAndVerify = async function(
  size: number,
  expectOut: number,
  isBuy: boolean = true,
  quoteAmount: number = 0
) {
  const [caller] = await ethers.getSigners();
  console.log("size ", size);
  console.log("expectOut ", expectOut);

  if (isBuy) {
    await expect(marketBuy(size, isBuy))
      .to.emit(pairManager, "Swap")
      .withArgs(caller.address, 0, quoteAmount, expectOut, 0, caller.address);

  } else {
    await expect(marketBuy(size, isBuy))
      .to.emit(pairManager, "Swap")
      .withArgs(caller.address, expectOut, 0, 0, quoteAmount, caller.address);
  }

};
export const verifyLimitOrderDetail = async function(
  {
    pip,
    orderId,
    partialFilled,
    isFilled
  }: {
    pip: number;
    orderId: number;
    partialFilled: number;
    isFilled: boolean;
  } = {
    partialFilled: 0,
    pip: 0,
    orderId: 0,
    isFilled: false
  }
) {
  const orderDetail = await pairManager.getPendingOrderDetail(
    pip,
    Number(orderId).toString()
  );
  expect(orderDetail.partialFilled.toNumber()).eq(
    partialFilled,
    `Incorrect partial filled amount`
  );
  expect(orderDetail.isFilled).eq(isFilled, "Order not filled");
};
export const checkLiquidityAtPip = async function(
  pip: number,
  hasLiquidity: boolean
) {
  expect(await pairManager.hasLiquidity(pip)).eq(
    hasLiquidity,
    `!hasLiquidity pip: ${pip}`
  );
};
export const shouldReachPip = async function(pip: number) {
  expect((await pairManager.getCurrentPip()).toNumber()).eq(pip);
};

export async function createLimitOrderInPipRanges(
  pipRanges: number[],
  size: number[],
  isBuy = false
) {
  const orders = [];
  for (const i in pipRanges) {
    const orderId = await createLimitOrderAndVerify(
      pipRanges[i],
      size[i],
      isBuy
    );
    orders.push([pipRanges[i], orderId]);
  }
  return orders;
}

interface CreateMarketOrderAndVerifyAfterArg {
  size: number;
  sizeOut: number;
  pips: number[];
  pipsHasLiquidity: boolean[];
  reachPip: number;
  orders?: number[][];
  partialFilledAmounts?: number[];
  isFilledAmounts?: boolean[];
  isBuy?: boolean;
  quoteAmount?: number;
}

export async function createMarketOrderAndVerifyAfter({
                                                 size,
                                                 sizeOut,
                                                 pips,
                                                 pipsHasLiquidity,
                                                 reachPip,
                                                 orders,
                                                 partialFilledAmounts,
                                                 isFilledAmounts,
                                                 isBuy = true,
                                                 quoteAmount = 0
                                               }: CreateMarketOrderAndVerifyAfterArg) {
  await shouldBuyMarketAndVerify(size, sizeOut, isBuy, quoteAmount);

  for (const i in pipsHasLiquidity) {
    await checkLiquidityAtPip(pips[i], pipsHasLiquidity[i]);
  }
  if (orders && partialFilledAmounts && isFilledAmounts && orders.length > 0)
    for (const orderIndex in orders) {
      await verifyLimitOrderDetail({
        pip: orders[orderIndex][0],
        orderId: orders[orderIndex][1],
        partialFilled: partialFilledAmounts[orderIndex],
        isFilled: isFilledAmounts[orderIndex]
      });
    }

  await shouldReachPip(reachPip);
}
