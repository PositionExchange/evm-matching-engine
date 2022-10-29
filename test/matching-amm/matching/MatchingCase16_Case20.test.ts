import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase16-Case20", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #16", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 80000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 80000
      Size : 20
      Side: 1
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      Liquidity: 
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
      Liquidity: 
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
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      Liquidity: 
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 152.2155730292
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 37.7844269708
      QuoteVirtual: 708.1702632457
      BaseReal: 660.7318507105
      QuoteReal: 5285.8548056844
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #17", async () => {
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
      Liquidity: 
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
      Liquidity: 
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
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 0
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
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 0
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 138.0839927994
  Expect:
    Pool:
      K: 6609.4321677526
      Liquidity: 
      BaseVirtual: 4.4799704888
      QuoteVirtual: 127.7310955316
      BaseReal: 51.4176318698
      QuoteReal: 128.5440796746
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #18", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 80000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 80000
      Size : 20
      Side: 1
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      Liquidity: 
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
      Liquidity: 
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
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      Liquidity: 
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 96.5953637718
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 83.4046362282
      QuoteVirtual: 366.7798773371
      BaseReal: 706.3520599680
      QuoteReal: 4944.4644197759
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #19", async () => {
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
      Liquidity: 
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
      Liquidity: 
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
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 0
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
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 0
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 187.9647752300
  Expect:
    Pool:
      K: 6609.4321677526
      Liquidity: 
      BaseVirtual: 34.3607529194
      QuoteVirtual: 80.4854301574
      BaseReal: 81.2984143004
      QuoteReal: 81.2984143004
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #20", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 80000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 80000
      Size : 20
      Side: 1
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      Liquidity: 
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
      Liquidity: 
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
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      Liquidity: 
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 0
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 181.9433741658
  Expect:
    Pool:
      K: 3492532.6283470900
      Liquidity: 
      BaseVirtual: 18.0566258342
      QuoteVirtual: 870.8498789401
      BaseReal: 641.0040495740
      QuoteReal: 5448.5344213789
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
})
