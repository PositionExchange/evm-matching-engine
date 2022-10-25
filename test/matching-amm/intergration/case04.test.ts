import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case04", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
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
})
