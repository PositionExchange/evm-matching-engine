import { AddLiquidityParams, ExpectOrderAddLiquidity } from "./interfaces";
import { toWei } from "./utils";
import { IERC20, NonfungiblePositionLiquidityPool, PairManager, PositionLiquidityPool } from "../../typeChain";
import { expect } from "chai";
import { BigNumber } from "ethers";


export async function addLiquidityAndCorrect(
  params: AddLiquidityParams,
  nftLiquidityPool:NonfungiblePositionLiquidityPool,
  liquidityPool: PositionLiquidityPool,
  pairManager: PairManager,
  user: any,
  baseAsset : IERC20,
  quoteAsset : IERC20,
  expectQuoteAdded : number,
  expectBaseAdded : number,
  expectNFTs : number[]) {

  const quoteBalanceUserBefore = await  quoteAsset.balanceOf(user.address);
  const baseBalanceUserBefore = await  baseAsset.balanceOf(user.address);



  const txAddLiquidity = await liquidityPool.connect(user).addLiquidity({
    poolId: params.poolId,
    baseAmount: toWei(params.baseAmount),
    quoteAmount: toWei(params.quoteAmount)
  });

  console.log(
    "GAS USED ADD LIQUIDITY",
    (await txAddLiquidity.wait()).gasUsed.toString()
  );


  const quoteBalanceUserAfter = await  quoteAsset.balanceOf(user.address);
  const baseBalanceUserAfter = await  baseAsset.balanceOf(user.address);

  expect(quoteBalanceUserBefore.sub(quoteBalanceUserAfter)).to.eq(toWei(expectQuoteAdded))
  expect(baseBalanceUserBefore.sub(baseBalanceUserAfter)).to.eq(toWei(expectBaseAdded))



  if (expectNFTs.length > 0 ){
    const tokens = await nftLiquidityPool.tokensOfOwner(user.address);

    for (const tokenId of expectNFTs) {
      const index = expectNFTs.indexOf(tokenId);
      expect(tokenId.toString()).to.eq(tokens[index].toString());

      const liquidityInfo = await liquidityPool.liquidityInfo(tokens[index]);
      expect(liquidityInfo.baseAmount).to.equal(toWei(expectBaseAdded));
      expect(liquidityInfo.quoteAmount).to.equal(toWei(expectQuoteAdded));

    }
  }

}
