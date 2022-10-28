import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("CaseLiquidity", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case Liquidity #01", async () => {
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
    BaseVirtual: 35
    QuoteVirtual: 631.3180125644
  Expect:
    Pool:
      K: 18437283.0566570000
      Liquidity: 4293.8657473956
      BaseVirtual: 45
      QuoteVirtual: 811.6945875827
      BaseReal: 1057.0766738240
      QuoteReal: 17441.7651180963
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
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
      K: 91048311.3908989000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 33
    QuoteVirtual: 595.2426975607
  Expect:
    Pool:
      K: 161055358.0193610000
      Liquidity: 12690.7587645247
      BaseVirtual: 133
      QuoteVirtual: 2399.0084477446
      BaseReal: 3124.2488359688
      QuoteReal: 51550.1057934846
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 12690.7587645247
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2991.2488359688
      QuoteReal: 49151.0973457401
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
    `)
    })
    it ("Case Liquidity #02", async () => {
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
    BaseVirtual: 35
    QuoteVirtual: 631.3180125644
  Expect:
    Pool:
      K: 18437283.0566570000
      Liquidity: 4293.8657473956
      BaseVirtual: 45
      QuoteVirtual: 811.6945875827
      BaseReal: 1057.0766738240
      QuoteReal: 17441.7651180963
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
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
      K: 91048311.3908989000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 15
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 15
      Side: 1
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 20
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 90
      QuoteVirtual: 1969.4711619781
      BaseReal: 2339.0592751645
      QuoteReal: 38925.1834520082
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 9541.9238831013
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2249.0592751645
      QuoteReal: 36955.7122900301
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
    `)
    })
    it ("Case Liquidity #03", async () => {
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
    QuoteVirtual: 631.3180125644
  Expect:
    Pool:
      K: 18437283.0566570000
      Liquidity: 4293.8657473956
      BaseVirtual: 45
      QuoteVirtual: 811.6945875827
      BaseReal: 1057.0766738240
      QuoteReal: 17441.7651180963
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
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
      K: 91048311.3908989000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 0
    Quantity: 15
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 15
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 20
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 110
      QuoteVirtual: 1639.4651815281
      BaseReal: 2359.0592751645
      QuoteReal: 38595.1774715583
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.1923883101
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2348.0592751645
      QuoteReal: 38431.2309534055
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S7: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 5248.0581357057
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2287.5592751645
      QuoteReal: 37529.5251035650
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S8: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 5
    Liquidity: 3339.6733590855
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2249.0592751645
      QuoteReal: 36955.7122900301
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
    `)
    })
    it ("Case Liquidity #04", async () => {
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
- S4: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 0
    Quantity: 15
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 15
      Side: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 20
  Expect:
    Pool:
      Liquidity: 6202.2505240158
      BaseVirtual: 55
      QuoteVirtual: 1338.5354905879
      BaseReal: 1516.8885288569
      QuoteReal: 25359.7484791075
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.1923883101
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1508.4269903954
      QuoteReal: 25153.8199420940
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S7: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 5248.0581357057
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1461.8885288569
      QuoteReal: 24021.2129885196
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S8: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 6
    Liquidity: 2001.8473514920
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 436.8399457134
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
    `)
    })
    it ("Case Liquidity #05", async () => {
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
    IndexPipRange: 4
    BaseVirtual: 0
    QuoteVirtual: 35
  Expect:
    Pool:
      K: 7327.7070836341
      Liquidity: 85.6020273337
      BaseVirtual: 0
      QuoteVirtual: 35
      BaseReal: 0
      QuoteReal: 331.5341211456
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 0
    QuoteVirtual: 15
  Expect:
    Pool:
      K: 1044.6802213900
      Liquidity: 32.3215132905
      BaseVirtual: 0
      QuoteVirtual: 15
      BaseReal: 0
      QuoteReal: 111.9645398716
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: AddLiquidity
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
- S5: OpenLimit
  Action:
    Id: 4
    Asset: base
    Side: 0
    Quantity: 15
    Price: 165000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 165000
      Size : 15
      Side: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 20
  Expect:
    Pool:
      Liquidity: 6202.2505240158
      BaseVirtual: 75
      QuoteVirtual: 1008.5213353262
      BaseReal: 1536.8885288569
      QuoteReal: 25029.7343238458
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S7: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 954.1923883101
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1525.3500673185
      QuoteReal: 24874.5771953341
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S8: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 5248.0581357057
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 1461.8885288569
      QuoteReal: 24021.2129885196
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S9: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 4
    Liquidity: 85.6020273337
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 296.5341211456
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
- S10: RemoveLiquidity
  Action:
    Id: 3
    IndexPipRange: 3
    Liquidity: 32.3215132905
  Expect:
    Pool:
      Liquidity: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 96.9645398716
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
    `)
    })



})
