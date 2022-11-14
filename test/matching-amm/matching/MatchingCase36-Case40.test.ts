import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase36-Case40", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #36", async () => {
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
- S2: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 65000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 65000
      Size : 20
      Side: 1
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 10
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 17819.0440221790
      BaseVirtual: 10
      QuoteVirtual: 0
      BaseReal: 54.4962445528
      QuoteReal: 326.977467
      IndexPipRange: 2
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 40000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 40000
      Size : 20
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 37.1383826965
  Expect:
    Pool:
      BaseVirtual: 7.8616173035
      QuoteVirtual: 13.3540843738
      BaseReal: 52.3578618564
      QuoteReal: 340.3317742627
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 274974.5036167670
      BaseVirtual: 0
      QuoteVirtual: 376.2000064930
      BaseReal: 214.0790689603
      QuoteReal: 1284.4530058551
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S7: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 50.2503351268
  Expect:
    Pool:
      BaseVirtual: 48.1123709349
      QuoteVirtual: 140.4984882809
      BaseReal: 262.1922417815
      QuoteReal: 1048.7514876430
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #37", async () => {
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
- S2: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 30
    Price: 50000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 50000
      Size : 30
      Side: 1
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383488
  Expect:
    Pool:
      K: 411717.8511711620
      BaseVirtual: 25
      QuoteVirtual: 323.4038458721
      BaseReal: 286.9556938523
      QuoteReal: 1434.7784692613
      IndexPipRange: 1 
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 10
    Price: 50000
- S5: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 15
    Price: 58000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 58000
      Size : 15
      Side: 1
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 55.5240207936
  Expect:
    Pool:
      BaseVirtual: 4.4759792064
      QuoteVirtual: 433.9290803509
      BaseReal: 266.4316730586
      QuoteReal: 1545.3037037401
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 33.526901
      QuoteReal: 100.5807029593
      IndexPipRange: 0
      MaxPip: 30000  
      MinPip: 1 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 130
  Expect:
    Pool:
      BaseVirtual: 25.9734652622
      QuoteVirtual: 56.0938938855
      BaseReal: 59.5003662487
      QuoteReal: 56.6745968448
      IndexPipRange: 0
      MaxPip: 30000  
      MinPip: 1  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: Expect
  Pool:
    BaseVirtual: 108.5025139441
    QuoteVirtual: 0
    BaseReal: 370.4582077964
    QuoteReal: 1111.3746233892
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #38", async () => {
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
- S2: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 10
    Price: 50000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 50000
      Size : 10
      Side: 0
- S3: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 30
    Price: 50000
  Expect:
    PendingOrder:
      OrderId: 2
      Price: 50000
      Size : 20
      Side: 1
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 15
    Price: 80000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 80000
      Size : 15
      Side: 1
- S5: OpenLimit
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
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 30.3223150839
  Expect:
    Pool:
      BaseVirtual: 35.3223150839
      QuoteVirtual: 103.1581515476
      BaseReal: 192.4957313953
      QuoteReal: 769.9829255811
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 3269.774673
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 133.3334386762
  Expect:
    Pool:
      BaseVirtual: 26.9888764077
      QuoteVirtual: 505.8359023183
      BaseReal: 471.9513219361
      QuoteReal: 3775.6105754889
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 276.2000064930
    BaseReal: 157.1734163114
    QuoteReal: 943.0247805265
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })

})
