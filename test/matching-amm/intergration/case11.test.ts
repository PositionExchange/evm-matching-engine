import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case11", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #11", async () => {
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
- S2: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 8
  Expect:
    Pool:
      K: 
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 0
      MaxPip: 0
      MinPip: 0
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 1
    BaseVirtual: 15
    QuoteVirtual: 43.80559127
  Expect:
    Pool:
      K: 26727.2446110291
      Liquidity: 
      BaseVirtual: 15
      QuoteVirtual: 43.80559127
      BaseReal: 81.7423461417
      QuoteReal: 326.9693845670
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 16
  Expect:
    Pool:
      K: 26727.2446110291
      Liquidity: 
      BaseVirtual: 23
      QuoteVirtual: 14.6582022302
      BaseReal: 89.7423461417
      QuoteReal: 297.8219955250
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 5
  Expect:
    Pool:
      K: 26727.2446110291
      Liquidity: 
      BaseVirtual: 18
      QuoteVirtual: 32.2304083989
      BaseReal: 84.7423461417
      QuoteReal: 315.3942016937
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
})
