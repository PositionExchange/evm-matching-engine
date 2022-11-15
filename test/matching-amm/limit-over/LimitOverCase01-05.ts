import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("LimitOver01_Case05", async function(){
    let testHelper: TestMatchingAmm
    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Case #01", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 20000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 20000
      Size : 20
      Side: 0
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      BaseVirtual: 10
      QuoteVirtual: 129.3615383
      BaseReal: 114.7822775409
      QuoteReal: 573.9113877045
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 30
    QuoteVirtual: 388.084615
  Expect:
    Pool:
      K: 1053997.6989981800
      BaseVirtual: 40
      QuoteVirtual: 517.4461534
      BaseReal: 459.1291101636
      QuoteReal: 2295.6455508181
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 33.5269009864
      QuoteReal: 100.5807029593
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 46.9376613810
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 140
    Price: 30000
    `)
    })
    it ("Case #02", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 20000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 20000
      Size : 20
      Side: 0
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      BaseVirtual: 10
      QuoteVirtual: 129.3615383
      BaseReal: 114.7822775409
      QuoteReal: 573.9113877045
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 30
    QuoteVirtual: 388.084615
  Expect:
    Pool:
      K: 1053997.6989981800
      BaseVirtual: 40
      QuoteVirtual: 517.4461534
      BaseReal: 459.1291101636
      QuoteReal: 2295.6455508181
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 33.5269009864
      QuoteReal: 100.5807029593
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 46.9376613810
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 50
    Price: 35000      
- S7: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 240
    Price: 30000
    `)
    })
})
