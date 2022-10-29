import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase06_Case10", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #6", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
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
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 55000
  Expect:
    PendingOrder: 
      OrderId: 2
      Price: 55000
      Size : 20
      Side: 1
- S3: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 1
    BaseVirtual: 2.319081883
    QuoteVirtual: 30
  Expect:
    Pool:
      K: 3542.842506
      Liquidity: 
      BaseVirtual: 2.319081883
      QuoteVirtual: 30
      BaseReal: 26.61895004
      QuoteReal: 133.0947502
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 1
    Quantity: 15
    Price: 55000
  Expect:
    PendingOrder: 
      OrderId: 3
      Price: 55000
      Size : 15
      Side: 1
- S5: OpenMarket
  Action:
    id: 3
    asset: quote
    Side: 0
    Quantity: 10
  Expect:
    Pool:
      K: 3542.842506
      Liquidity: 
      BaseVirtual: 0.4588494149
      QuoteVirtual: 40
      BaseReal: 24.75871757
      QuoteReal: 143.0947502
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #7", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 10
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 40000
      Size : 10
      Side: 0
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 20
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 2
      Price: 40000
      Size : 20
      Side: 0
- S3: AddLiquidity
  Action:
    Id: 3
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
- S4: OpenLimit
  Action:
    Id: 4
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
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 82.0964201119
  Expect:
    Pool:
      K: 263499.4247
      Liquidity: 
      BaseVirtual: 72.09642011
      QuoteVirtual: 46.42012106
      BaseReal: 281.6609752
      QuoteReal: 935.5198198
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #8", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 35000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 10
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 40000
      Size : 10
      Side: 1
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 2
      Price: 40000
      Size : 20
      Side: 1
- S3: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 1
    BaseVirtual: 18.19753781
    QuoteVirtual: 20
  Expect:
    Pool:
      K: 20769.18512
      Liquidity: 
      BaseVirtual: 18.19753781
      QuoteVirtual: 20
      BaseReal: 77.03280399
      QuoteReal: 269.614814
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 1
    Quantity: 15
    Price: 50000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 50000
      Size : 15
      Side: 1
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 40.7263798231
  Expect:
    Pool:
      K: 20769.18512
      Liquidity: 
      BaseVirtual: 7.471157991
      QuoteVirtual: 63.61554611
      BaseReal: 66.30642417
      QuoteReal: 313.2303601
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
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
