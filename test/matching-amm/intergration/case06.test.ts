import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case06", async function(){
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
})
