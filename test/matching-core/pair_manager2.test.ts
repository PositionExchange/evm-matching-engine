// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { MockToken, PairManager } from "../../typeChain";
// import { deployContract, getAccount, toWei } from "../utils/utils";
// import { BigNumber } from "ethers";
// import { deployMockToken } from "../utils/mock";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//
// // READ.ME
// // Before you run this test
// // Please ENSURE you have added event `Swap(msg.sender, size, sizeOut);`
// // in function `_internalOpenMarketOrder()`
//
//
// describe("estimate amount",  ()=>{
//
//   let quoteAsset: MockToken, baseAsset: MockToken, pairManager: PairManager;
//
//
//   let [deployer, user1, user2, user3, user4, user5]: SignerWithAddress[] = [];
//
//   beforeEach(async ()=>{
//     [deployer, user1, user2, user3, user4, user5] = await getAccount();
//
//     // deploy mock token
//     quoteAsset = await deployMockToken("Quote Asset");
//     baseAsset = await deployMockToken("Base Asset");
//
//     // const [deployer] = await ethers.getSigners();
//
//     pairManager = await deployContract("PairManager", deployer);
//     await pairManager.initializeFactory(
//       quoteAsset.address,
//       baseAsset.address,
//       deployer.address,
//       BigNumber.from(10000),
//       BigNumber.from(10000),
//       BigNumber.from(10000),
//       BigNumber.from(100000),
//       BigNumber.from(0),
//       baseAsset.address,
//       deployer.address
//     );
//
//   })
//
//   describe("abc", async () => {
//     it("estimate buy amount", async ()=>{
//
//
//       console.log("1");
//       await pairManager.openLimit(100000, toWei(12), true, deployer.address,0);
//       console.log("2");
//
//       await pairManager.openLimit(110000, toWei(10), false, deployer.address,0);
//       console.log("3");
//
//
//
//       const { sizeOut, openOtherSide } = await  pairManager.getAmountEstimate(toWei(3), true, false);
//       console.log("sizeOut, openOtherSide ", sizeOut.toString(), openOtherSide.toString());
//     })
//   })
//
// })
