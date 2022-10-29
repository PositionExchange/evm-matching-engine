import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("CaseLiquidityCase11-15", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case Liquidity #11", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
      K: 910483.1139089900
      Liquidity: 954.1923883101
      BaseVirtual: 10
      QuoteVirtual: 180.3765750184
      BaseReal: 234.9059275164
      QuoteReal: 3875.9478040214
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    BaseVirtual: 55
    QuoteVirtual: 992.0711626011
  Expect:
    Pool:
      K: 38467911.5626548000
      Liquidity: 6202.2505240158
      BaseVirtual: 65
      QuoteVirtual: 1172.4477376195
      BaseReal: 1526.8885288569
      QuoteReal: 25193.6607261391
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 74.52567
  Expect:
    Pool:
      Liquidity: 6202.2505240158
      BaseVirtual: 139.5256703777
      QuoteVirtual: 0
      BaseReal: 1601.4141992346
      QuoteReal: 24021.2129885196
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.1923883101
  Expect:
    Pool:
      Liquidity: 5248.0581357057
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1355.0427839678
      QuoteReal: 20325.6417595166
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S5: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Liquidity: 5248.0581357057
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
    `)
    })

})
