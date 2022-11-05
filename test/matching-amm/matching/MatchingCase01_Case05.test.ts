import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase01-Case05", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #1", async () => {
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
    Price: 30000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 30000
      Size : 10
      Side: 0
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 20
    Price: 30000
  Expect:
    PendingOrder:
      OrderId: 2
      Price: 30000
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
      OrderId: 3
      Price: 30000
      Size : 15
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 111.8020112
  Expect:
    Pool:
      K: 263499.4247
      BaseVirtual: 86.80201116
      QuoteVirtual: 0
      BaseReal: 296.3665662
      QuoteReal: 889.0996987
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #2", async () => {
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
    Price: 59999
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 59999
      Size : 10
      Side: 1
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 59999
  Expect:
    PendingOrder: 
      OrderId: 2
      Price: 59999
      Size : 20
      Side: 1
- S3: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 1
    BaseVirtual: 1.546054589
    QuoteVirtual: 20
  Expect:
    Pool:
      K: 1574.596669
      Liquidity: 
      BaseVirtual: 1.546054589
      QuoteVirtual: 20
      BaseReal: 17.74596669
      QuoteReal: 88.72983346
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
    Price: 59999
  Expect:
    PendingOrder: 
      OrderId: 3
      Price: 59999
      Size : 15
      Side: 1
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 46.54605459
  Expect:
    Pool:
      K: 1574.596669
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 28.46801917
      BaseReal: 16.1999121
      QuoteReal: 97.19785263
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
    `)
    })
    it ("Case #3", async () => {
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
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 3
      Price: 40000
      Size : 15
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 62.09642011
  Expect:
    Pool:
      K: 263499.4247
      Liquidity: 
      BaseVirtual: 47.09642011
      QuoteVirtual: 137.5442021
      BaseReal: 256.6609752
      QuoteReal: 1026.643901
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #4", async () => {
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
    BaseVirtual: 1.546054589
    QuoteVirtual: 20
  Expect:
    Pool:
      K: 1574.596669
      Liquidity: 
      BaseVirtual: 1.546054589
      QuoteVirtual: 20
      BaseReal: 17.74596669
      QuoteReal: 88.72983346
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
    asset: base
    Side: 0
    Quantity: 10.82585134
  Expect:
    Pool:
      K: 1574.596669
      Liquidity: 
      BaseVirtual: 0.7202032478
      QuoteVirtual: 24.33080097
      BaseReal: 16.92011535
      QuoteReal: 93.06063443
      IndexPipRange: 1 
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #5", async () => {
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
    BaseVirtual: 30
    QuoteVirtual: 388.084615
  Expect:
    Pool:
      K: 592873.7057
      Liquidity: 
      BaseVirtual: 30
      QuoteVirtual: 388.084615
      BaseReal: 344.3468326
      QuoteReal: 1721.734163
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
    Price: 40000
  Expect:
    PendingOrder: 
      OrderId: 3
      Price: 40000
      Size : 15
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 10
  Expect:
    Pool:
      K: 592873.7057
      Liquidity: 
      BaseVirtual: 40
      QuoteVirtual: 339.4956619
      BaseReal: 354.3468326
      QuoteReal: 1673.14521
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
})
