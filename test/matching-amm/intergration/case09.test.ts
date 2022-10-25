import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case09", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #9", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 20
    QuoteVirtual: 258.7230767
  Expect:
    Pool:
      K: 263499.424749
      Liquidity: 
      BaseVirtual: 20
      QuoteVirtual: 258.7230767
      BaseReal: 229.5645551
      QuoteReal: 1147.822775
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 1.546054589
    QuoteVirtual: 20
  Expect:
    Pool:
      K: 305812.4709
      Liquidity: 
      BaseVirtual: 21.54605459
      QuoteVirtual: 278.7230767
      BaseReal: 247.3105218
      QuoteReal: 1236.552609
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 15
    Price: 30000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 30000
      Size : 15
      Side: 0
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 1
    Quantity: 15
    Price: 59999
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 59999
      Size : 15
      Side: 1
- S5: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 76.96598895
  Expect:
    Pool:
      K: 305812.4709
      Liquidity: 
      BaseVirtual: 93.51204354
      QuoteVirtual: 0
      BaseReal: 319.2765107
      QuoteReal: 957.8295322
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 1
    asset: base
    Side: 0
    Quantity: 108.5120435
  Expect:
    Pool:
      K: 305812.4709
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 396.7346945
      BaseReal: 225.7644672
      QuoteReal: 1354.564227
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
})
