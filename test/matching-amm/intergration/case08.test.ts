import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case08", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
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
})
