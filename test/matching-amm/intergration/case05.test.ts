import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case05", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
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
