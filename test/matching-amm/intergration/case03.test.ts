import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case01", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
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
})
