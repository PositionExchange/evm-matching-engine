import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("Case36-Case40", async function(){
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
      Liquidity: 
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
      Liquidity: 
      BaseVirtual: 10
      QuoteVirtual: 0
      BaseReal: 54.4962445528
      QuoteReal: 0
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
      Liquidity: 
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
      Liquidity: 
      BaseVirtual: 0
      QuoteVirtual: 376.2000064930
      BaseReal: 0
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
      Liquidity: 
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

})
