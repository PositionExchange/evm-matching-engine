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
    it ("Case Liquidity #12", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 100
    QuoteVirtual: 1803.76575
  Expect:
    Pool:
      K: 91048311.3908990000
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.76575
      BaseReal: 2349.059275164
      QuoteReal: 38759.478040214
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
    QuoteVirtual: 200
  Expect:
    Pool:
      K: 239272.06803703000
      Liquidity: 489.15444190668
      BaseVirtual: 0
      QuoteVirtual: 200
      BaseReal: 0
      QuoteReal: 1894.48069226072
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 200
    QuoteVirtual: 3607.53150
  Expect:
    Pool:
      K: 819434802.5180910000
      Liquidity: 28625.7716493039
      BaseVirtual: 300
      QuoteVirtual: 5411.2972505517
      BaseReal: 7047.1778254935
      QuoteReal: 116278.4341206420
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S4: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 9541.9238831013
  Expect:
    Pool:
      Liquidity: 19083.8477662026
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 4698.1185503290
      QuoteReal: 77518.9560804281
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S5: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 240
  Expect:
    Pool:
      Liquidity: 489.15444190668
      BaseVirtual: 10.6902449916
      QuoteVirtual: 52.1607976591
      BaseReal: 136.9897998060
      QuoteReal: 1746.6414899198
      IndexPipRange: 4
      MaxPip: 149999
      MinPip: 120000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S6: RemoveLiquidity
  Action:
    Id: 2
    IndexPipRange: 4
    Liquidity: 489.1544419067
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
- S7: AddLiquidity
  Action:
    Id: 4
    IndexPipRange: 5
    BaseVirtual: 199
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 780077907.2281020000
      Liquidity: 27929.8748158330
      BaseVirtual: 628.3097550084
      QuoteVirtual: 0
      BaseReal: 7211.4626682253
      QuoteReal: 108171.9400233790
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 6
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 32713410.7646969000
      Liquidity: 5719.5638614056
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 1348.11413060980
      QuoteReal: 0
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 190
    Price: 190000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 190000
      Size : 190
      Side: 1
- S10: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 120
    Price: 160000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 160000
      Size : 120
      Side: 0
- S11: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 228.99396
  Expect:
    Pool:
      Liquidity: 27929.8748158330
      BaseVirtual: 399.3157907414
      QuoteVirtual: 3547.5592399528
      BaseReal: 6982.4687039583
      QuoteReal: 111719.4992633320
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S12: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 120
  Expect:
    Pool:
      Liquidity: 27929.8748158330
      BaseVirtual: 399.3157907414
      QuoteVirtual: 3547.5592399528
      BaseReal: 6982.4687039583
      QuoteReal: 111719.4992633320
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S13: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Liquidity: 19083.8477662026
  Expect:
    Pool:
      Liquidity: 8846.0270496304
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 2211.5067624076
      QuoteReal: 35384.1081985215
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S14: RemoveLiquidity
  Action:
    Id: 4
    IndexPipRange: 5
    Liquidity: 8846.0270496304
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
- S15: RemoveLiquidity
  Action:
    Id: 1
    IndexPipRange: 6
    Liquidity: 5719.5638614056
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
//     it ("Case Liquidity #13", async () => {
//         return testHelper.process(`
// - S0: SetCurrentPrice
//   Action:
//     Price: 165000
// - S1: AddLiquidity
//   Action:
//     Id: 1
//     IndexPipRange: 5
//     BaseVirtual: 10
//     QuoteVirtual: 180.3765750184
//   Expect:
//     Pool:
//       K: 910483.1139089900
//       Liquidity: 954.1923883101
//       BaseVirtual: 10
//       QuoteVirtual: 180.3765750184
//       BaseReal: 234.9059275164
//       QuoteReal: 3875.9478040214
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S2: AddLiquidity
//   Action:
//     Id: 2
//     IndexPipRange: 4
//     BaseVirtual: 0
//     QuoteVirtual: 35
//   Expect:
//     Pool:
//       K: 7327.7070836341
//       Liquidity: 85.60202733367
//       BaseVirtual: 0
//       QuoteVirtual: 35
//       BaseReal: 0
//       QuoteReal: 331.53412114563
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S3: AddLiquidity
//   Action:
//     Id: 3
//     IndexPipRange: 5
//     BaseVirtual: 55
//     QuoteVirtual: 992.0711626011
//   Expect:
//     Pool:
//       K: 38467911.5626548000
//       Liquidity: 6202.2505240158
//       BaseVirtual: 65
//       QuoteVirtual: 1172.4477376195
//       BaseReal: 1526.8885288569
//       QuoteReal: 25193.6607261391
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S4: OpenMarket
//   Action:
//     id: 4
//     asset: base
//     Side: 1
//     Quantity: 40
//   Expect:
//     Pool:
//       Liquidity: 6202.2505240158
//       BaseVirtual: 88.6741021470
//       QuoteVirtual: 787.7891075438
//       BaseReal: 1550.5626310040
//       QuoteReal: 24809.0020960634
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S5: OpenMarket
//   Action:
//     id: 5
//     asset: base
//     Side: 1
//     Quantity: 50.8515682307
//   Expect:
//     Pool:
//       Liquidity: 6202.2505240158
//       BaseVirtual: 139.5256703777
//       QuoteVirtual: 0
//       BaseReal: 1601.4141992346
//       QuoteReal: 24021.2129885196
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S6: AddLiquidity
//   Action:
//     Id: 6
//     IndexPipRange: 5
//     BaseVirtual: 20
//     QuoteVirtual: 0
//   Expect:
//     Pool:
//       K: 50286513.97221980000
//       Liquidity: 7091.2984687023
//       BaseVirtual: 159.5256703777
//       QuoteVirtual: 0
//       BaseReal: 1830.9653914847
//       QuoteReal: 27464.4808722702
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S7: AddLiquidity
//   Action:
//     Id: 2
//     IndexPipRange: 4
//     BaseVirtual: 0
//     QuoteVirtual: 20
//   Expect:
//     Pool:
//       K: 18094.9501453004
//       Liquidity: 134.51747152434
//       BaseVirtual: 0
//       QuoteVirtual: 55
//       BaseReal: 0
//       QuoteReal: 520.9821903717
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S8: OpenMarket
//   Action:
//     id: 4
//     asset: base
//     Side: 0
//     Quantity: 29.77378
//   Expect:
//     Pool:
//       Liquidity: 7091.2984687023
//       BaseVirtual: 129.7518911359
//       QuoteVirtual: 453.9891174947
//       BaseReal: 1801.1916122429
//       QuoteReal: 27918.4699897650
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S9: OpenMarket
//   Action:
//     id: 5
//     asset: base
//     Side: 1
//     Quantity: 60.76649
//   Expect:
//     Pool:
//       Liquidity: 134.51747152434
//       BaseVirtual: 1.2189289245
//       QuoteVirtual: 37.3361006075
//       BaseReal: 35.9513064985
//       QuoteReal: 503.3182909792
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S10: RemoveLiquidity
//   Action:
//     Id: 1
//     IndexPipRange: 5
//     Liquidity: 954.1923883101
//   Expect:
//     Pool:
//       Liquidity: 6137.1060803922
//       BaseVirtual: 0
//       QuoteVirtual: 0
//       BaseReal: 1584.5939762178
//       QuoteReal: 23768.9096432672
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
// - S11: RemoveLiquidity
//   Action:
//     Id: 2
//     IndexPipRange: 4
//     Liquidity: 85.6020273337
//   Expect:
//     Pool:
//       Liquidity: 48.9154441907
//       BaseVirtual: 0
//       QuoteVirtual: 0
//       BaseReal: 13.0732023631
//       QuoteReal: 183.0248330833
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
// - S12: OpenLimit
//   Action:
//     Id: 3
//     Asset: base
//     Side: 0
//     Quantity: 143
//     Price: 150000
//   Expect:
//     PendingOrder:
//       OrderId: 1
//       Price: 150000
//       Size : 143
//       Side: 0
// - S13: OpenMarket
//   Action:
//     id: 4
//     asset: base
//     Side: 0
//     Quantity: 0.44325
//   Expect:
//     Pool:
//       Liquidity: 48.9154441907
//       BaseVirtual: 0
//       QuoteVirtual: 20
//       BaseReal: 12.6299554814
//       QuoteReal: 189.4480692261
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
//       FeeGrowthBase: 0
//       FeeGrowthQuote: 0
// - S14: RemoveLiquidity
//   Action:
//     Id: 3
//     IndexPipRange: 5
//     Liquidity: 5248.0581357057
//   Expect:
//     Pool:
//       Liquidity: 889.0479446865
//       BaseVirtual: 0
//       QuoteVirtual: 0
//       BaseReal: 229.5511922500
//       QuoteReal: 3443.2678837506
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
// - S15: RemoveLiquidity
//   Action:
//     Id: 6
//     IndexPipRange: 5
//     Liquidity: 889.0479446865
//   Expect:
//     Pool:
//       Liquidity: 0
//       BaseVirtual: 0
//       QuoteVirtual: 0
//       BaseReal: 0
//       QuoteReal: 0
//       IndexPipRange: 5
//       MaxPip: 179999
//       MinPip: 150000
// - S16: RemoveLiquidity
//   Action:
//     Id: 2
//     IndexPipRange: 4
//     Liquidity: 48.9154441907
//   Expect:
//     Pool:
//       Liquidity: 0
//       BaseVirtual: 0
//       QuoteVirtual: 0
//       BaseReal: 0
//       QuoteReal: 0
//       IndexPipRange: 4
//       MaxPip: 149999
//       MinPip: 120000
//     `)
//     })

})
