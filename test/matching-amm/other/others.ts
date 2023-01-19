import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("OtherCases", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("OpenMarketWithQuote-buy", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 69900
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 10
    Price: 70000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 70000
      Size : 10
      Side: 1
- S2: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 0
    Quantity: 1
    `)
    })
    it ("OpenMarketWithQuote-buy-2", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 170000
- S1: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 5
    BaseVirtual: 0.2704430339572
    QuoteVirtual: 9.9
- S2: OpenLimit
  Action:
    Id: 1
    Asset: quote
    Side: 0
    Quantity: 50
    Price: 150000
- S3: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 10
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 100
    Price: 179999
- S5: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 1
    Quantity: 10
    `)
    })
    it ("OpenMarketWithQuote-sell-3", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 20000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 10
    Price: 19000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 19000
      Size : 10
      Side: 0
- S3: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 1
    Quantity: 1
    `)
    })
    it ("OpenMarketWithQuote-sell-4", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 170000
- S1: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 5
    BaseVirtual: 0.2704430339572
    QuoteVirtual: 9.9
- S2: OpenLimit
  Action:
    Id: 1
    Asset: quote
    Side: 0
    Quantity: 50
    Price: 150000
- S3: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 1
    Quantity: 100
    `)
    })


})


describe("ReproduceManualCHZ", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Add CHZ", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 33757
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    Asset: base
    BaseVirtual: 1000000
    QuoteVirtual: 0
`)
    })
})
describe("ReproduceManualNoLiquidity", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Open with base #1", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 10000
- S1: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 10
`)
    })
})

describe("OpenMarketWithQuote", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Open with base", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 15
    QuoteVirtual: 194.0423075233
  Expect:
    Pool:
      K: 148218.4264216180
      BaseVirtual: 15
      QuoteVirtual: 194.0423075233
      BaseReal: 172.1734163114
      QuoteReal: 860.8670815568
      IndexPipRange: 1 
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
`)
    })
    it ("Open with base #2", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
      K: 910483.1139089900
      Liquidity: 954.1923883101
      BaseVirtual: 10
      QuoteVirtual: 180.3765750184
      BaseReal: 234.9059275164
      QuoteReal: 3875.9478040214
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 1
      TokenId: 1000001
      Liquidity: 954.19238831013
      BaseVirtual: 10.00000000000
      QuoteVirtual: 180.3765750184
      BalanceBase: 9990.00000
      BalanceQuote: 9819.62342
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 35
    QuoteVirtual: 631.31801256436
  Expect:
    Pool:
      K: 18437283.0566570000
      Liquidity: 4293.8657473956
      BaseVirtual: 45
      QuoteVirtual: 811.6945875827
      BaseReal: 1057.0766738240
      QuoteReal: 17441.7651180963
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 2
      TokenId: 1000002
      Liquidity: 3339.67335908545
      BaseVirtual: 35.00000000000
      QuoteVirtual: 631.31801256436
      BalanceBase: 9965.00000
      BalanceQuote: 9368.68199
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 55
    QuoteVirtual: 992.07116260114
  Expect:
    Pool:
      K: 91048311.3908989000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 1
      TokenId: 1000003
      Liquidity: 5248.05813570571
      BaseVirtual: 55.00000000000
      QuoteVirtual: 992.07116260114
      BalanceBase: 9935.00000
      BalanceQuote: 8827.55226
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 0
    Quantity: 10
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 10
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: quote
    Side: 1
    Quantity: 329.30057
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 110
      QuoteVirtual: 1639.4651815281
      BaseReal: 2359.0592751645
      QuoteReal: 38595.1774715583
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 3
      BalanceBase: 9980.00000
      BalanceQuote: 10329.30057
`)
    })
    it ("Open with base #2", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
      K: 910483.1139089900
      Liquidity: 954.1923883101
      BaseVirtual: 10
      QuoteVirtual: 180.3765750184
      BaseReal: 234.9059275164
      QuoteReal: 3875.9478040214
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 1
      TokenId: 1000001
      Liquidity: 954.19238831013
      BaseVirtual: 10.00000000000
      QuoteVirtual: 180.3765750184
      BalanceBase: 9990.00000
      BalanceQuote: 9819.62342
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 35
    QuoteVirtual: 631.31801256436
  Expect:
    Pool:
      K: 18437283.0566570000
      Liquidity: 4293.8657473956
      BaseVirtual: 45
      QuoteVirtual: 811.6945875827
      BaseReal: 1057.0766738240
      QuoteReal: 17441.7651180963
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 2
      TokenId: 1000002
      Liquidity: 3339.67335908545
      BaseVirtual: 35.00000000000
      QuoteVirtual: 631.31801256436
      BalanceBase: 9965.00000
      BalanceQuote: 9368.68199
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 55
    QuoteVirtual: 992.07116260114
  Expect:
    Pool:
      K: 91048311.3908989000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 1
      TokenId: 1000003
      Liquidity: 5248.05813570571
      BaseVirtual: 55.00000000000
      QuoteVirtual: 992.07116260114
      BalanceBase: 9935.00000
      BalanceQuote: 8827.55226
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 0
    Quantity: 10
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 10
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: quote
    Side: 1
    Quantity: 329.30057
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 110
      QuoteVirtual: 1639.4651815281
      BaseReal: 2359.0592751645
      QuoteReal: 38595.1774715583
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    User:
      Id: 3
      BalanceBase: 9980.00000
      BalanceQuote: 10329.30057
`)
    })

})

describe("BaisiPoint8", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper(300, 100_000_000)
    })
    it ("Open market pip 200", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 200
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 0
    BaseVirtual: 5
    QuoteVirtual: 0.000050641484465704
- S2: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 0.1
`)
    })


})
describe("Reach pip 1", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper(30000, 10_000)
    })
    it ("sell reach pip 1", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 20000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 0
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 108.22714675241
  Expect:
    Pool:
      K: 5940.26871952122
      Liquidity: 77.07313876780
      BaseVirtual: 10
      QuoteVirtual: 180.3765750184
      BaseReal: 54.498939070046
      QuoteReal: 108.99787814009
      IndexPipRange: 0
      MaxPip: 29999
      MinPip: 1
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S2: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 7652.81493771039
  Expect:
    Pool:
      K: 5940.26871952122
      Liquidity: 77.07313876780
      BaseVirtual: 7662.81493771039
      QuoteVirtual: 0
      BaseReal: 7707.313876780430
      QuoteReal: 0.77073138768
      IndexPipRange: 0
      MaxPip: 29999
      MinPip: 1
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
`)
    })


})
describe("POSI/BNB", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper(2000, 1_000_000)
    })
    it ("should sell ok", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 3000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 24.073632
    QuoteVirtual: 0.099000111653359784
  Expect:
    Pool:
      Liquidity: 9.849879189561687774
      BaseVirtual: 24.073632
      QuoteVirtual: 0.099000111653359784
      IndexPipRange: 1
      MaxPip: 3999
      MinPip: 2000
- S2: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 0.01

`)
    })


})
