import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("CaseLiquidityCase05-10", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Case Liquidity #06", async () => {
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
    IndexPipRange: 6
    BaseVirtual: 35
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 4007392.8186753700
      Liquidity: 2001.8473514920
      BaseVirtual: 35
      QuoteVirtual: 0
      BaseReal: 471.8399457134
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
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
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    BaseVirtual: 25
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 11776827.87529090000
      Liquidity: 3431.73831684336
      BaseVirtual: 60
      QuoteVirtual: 0
      BaseReal: 808.86847836588
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 69.45660955345
  Expect:
    Pool:
      Liquidity: 3431.73831684336
      BaseVirtual: 55.54339044655
      QuoteVirtual: 80.66340180042
      BaseReal: 804.41186881243
      QuoteReal: 14640.29601238630
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.19238831013
  Expect:
    Pool:
      Liquidity: 5248.05813570571
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1236.98260134047
      QuoteReal: 22265.56312586830
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S7: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 5248.05813570571
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
- S8: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    Liquidity: 2001.84735149196
  Expect:
    Pool:
      Liquidity: 1429.89096535140
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 335.17161200518
      QuoteReal: 6100.12333849429
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
- S9: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    Liquidity: 1429.89096535140
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
    `)
    })
    it ("Case Liquidity #07", async () => {
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
- S3: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 4
    BaseVirtual: 0
    QuoteVirtual: 35
  Expect:
    Pool:
      K: 7327.70708363406
      Liquidity: 85.60202733367
      BaseVirtual: 0
      QuoteVirtual: 35
      BaseReal: 0
      QuoteReal: 331.53412114563
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 4
    BaseVirtual: 0
    QuoteVirtual: 45
  Expect:
    Pool:
      K: 38283.53088592490
      Liquidity: 195.66177676267
      BaseVirtual: 0
      QuoteVirtual: 35
      BaseReal: 0
      QuoteReal: 757.79227690429
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 1
    asset: base
    Side: 1
    Quantity: 77.25823903361
  Expect:
    Pool:
      Liquidity: 195.66177676267
      BaseVirtual: 2.73256865589
      QuoteVirtual: 41.11499594805
      BaseReal: 53.25239058165
      QuoteReal: 718.90727285234
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.19238831013
  Expect:
    Pool:
      Liquidity: 5248.05813570571
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1355.04278396777
      QuoteReal: 20325.64175951660
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S7: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Liquidity: 5248.05813570571
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
- S8: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 4
    Liquidity: 85.60202733367
  Expect:
    Pool:
      Liquidity: 110.05974942900
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 29.95446970218
      QuoteReal: 404.38534097944
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
- S9: RemoveLiquidity
  Action:
    Id: 3
    IndexPipRange: 4
    Liquidity: 110.05974942900
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
    `)
    })
    it ("Case Liquidity #08", async () => {
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
    BaseVirtual: 35
    QuoteVirtual: 631.31801256436
  Expect:
    Pool:
      K: 18437283.05665700000
      Liquidity: 4293.86574739558
      BaseVirtual: 45
      QuoteVirtual: 811.69458758275
      BaseReal: 1057.07667382402
      QuoteReal: 17441.76511809630
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.19238831013
  Expect:
    Pool:
      Liquidity: 3339.67335908545
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 822.17074630757
      QuoteReal: 13565.81731407490
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    BaseVirtual: 55
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 9895806.75632081000
      Liquidity: 3145.76012377308
      BaseVirtual: 55
      QuoteVirtual: 0
      BaseReal: 741.46277183539
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 39.08522542399
  Expect:
    Pool:
      Liquidity: 3145.76012377308
      BaseVirtual: 50.91477457601
      QuoteVirtual: 73.94145165038
      BaseReal: 737.37754641140
      QuoteReal: 13420.27134468740
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Liquidity: 3339.67335908545
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
- S7: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    Liquidity: 3145.76012377308
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
    `)
    })
    it ("Case Liquidity #09", async () => {
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
- S3: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.1923883101
  Expect:
    Pool:
      Liquidity: 5248.05813570571
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1291.98260134047
      QuoteReal: 21317.71292211770
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S4: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 4
    BaseVirtual: 0
    QuoteVirtual: 35
  Expect:
    Pool:
      K: 7327.70708363406
      Liquidity: 85.60202733367
      BaseVirtual: 0
      QuoteVirtual: 35
      BaseReal: 0
      QuoteReal: 331.53412114563
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 1
    asset: base
    Side: 1
    Quantity: 64.69949121441
  Expect:
    Pool:
      Liquidity: 85.60202733367
      BaseVirtual: 1.63930858711
      QuoteVirtual: 12
      BaseReal: 23.74173067963
      QuoteReal: 308.64249883521
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Liquidity: 5248.05813570571
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
- S7: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 4
    Liquidity: 85.60202733367
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
    `)
    })
    it ("Case Liquidity #10", async () => {
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
    Id: 1
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
    Side: 0
    Quantity: 65
  Expect:
    Pool:
      Liquidity: 6202.2505240158
      BaseVirtual: 0
      QuoteVirtual: 2292.6343420520
      BaseReal: 1461.8885288569
      QuoteReal: 26313.8473305716
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
      BaseReal: 1236.9826013405
      QuoteReal: 22265.5631258683
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
