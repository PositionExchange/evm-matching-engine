import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case10", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #10", async () => {
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
      K: 263499.4247
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
    Quantity: 10
    Price: 35000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 35000
      Size : 10
      Side: 0
- S4: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 58.28208924
  Expect:
    Pool:
      K: 305812.4709
      Liquidity: 
      BaseVirtual: 69.82814383
      QuoteVirtual: 76.74460638
      BaseReal: 295.592611
      QuoteReal: 1034.574139
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 1
    Quantity: 20
    Price: 45000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 45000
      Size : 20
      Side: 1
- S6: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 15
    QuoteVirtual: 16.48574676
  Expect:
    Pool:
      K: 451309.1351
      Liquidity: 
      BaseVirtual: 84.82814383
      QuoteVirtual: 93.23035313
      BaseReal: 359.0897759
      QuoteReal: 1256.814216
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: OpenMarket
  Action:
    id: 1
    asset: base
    Side: 0
    Quantity: 62.40236078
  Expect:
    Pool:
      K: 451309.1351
      Liquidity: 
      BaseVirtual: 84.82814383
      QuoteVirtual: 93.23035313
      BaseReal: 316.6874152
      QuoteReal: 1425.093368
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 10
    Price: 30000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 30000
      Size : 10
      Side: 0
- S9: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 1
    Quantity: 10
    Price: 55000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 55000
      Size : 10
      Side: 1
- S10: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 30.23287009
  Expect:
    Pool:
      K: 451309.1351
      Liquidity: 
      BaseVirtual: 12.19291296
      QuoteVirtual: 411.9161352
      BaseReal: 286.4545451
      QuoteReal: 1575.499998
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S11: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 111.4067425
  Expect:
    Pool:
      K:
      Liquidity: 
      BaseVirtual: 113.5996554
      QuoteVirtual: 0
      BaseReal: 387.8612876
      QuoteReal: 1163.583863
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
})
