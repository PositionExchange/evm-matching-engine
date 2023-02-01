import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("LimitOver01_Case05", async function(){
    let testHelper: TestMatchingAmm
    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Case #01", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 20000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 20000
      Size : 20
      Side: 0
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      BaseVirtual: 10
      QuoteVirtual: 129.3615383
      BaseReal: 114.7822775409
      QuoteReal: 573.9113877045
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 30
    QuoteVirtual: 388.084615
  Expect:
    Pool:
      K: 1053997.6989981800
      BaseVirtual: 40
      QuoteVirtual: 517.4461534
      BaseReal: 459.1291101636
      QuoteReal: 2295.6455508181
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 33.5269009864
      QuoteReal: 100.5807029593
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 46.9376613810
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 140
    Price: 30000
    `)
    })
    it ("Case #02", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 20000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 20000
      Size : 20
      Side: 0
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 129.3615383
  Expect:
    Pool:
      K: 65874.8561873859
      BaseVirtual: 10
      QuoteVirtual: 129.3615383
      BaseReal: 114.7822775409
      QuoteReal: 573.9113877045
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 30
    QuoteVirtual: 388.084615
  Expect:
    Pool:
      K: 1053997.6989981800
      BaseVirtual: 40
      QuoteVirtual: 517.4461534
      BaseReal: 459.1291101636
      QuoteReal: 2295.6455508181
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 33.5269009864
      QuoteReal: 100.5807029593
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 0
      QuoteVirtual: 140
      BaseReal: 46.9376613810
      QuoteReal: 140.8129841430
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 50
    Price: 35000      
- S7: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 240
    Price: 30000
    `)
    })
    it ("Case #03", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
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
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
      Liquidity: 1908.3847766203
      BaseVirtual: 20
      QuoteVirtual: 360.7531500368
      BaseReal: 469.8118550329
      QuoteReal: 7751.8956080428
      IndexPipRange: 5 
      MaxPip: 179999 
      MinPip: 150000 
      FeeGrowthBase: 0 
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 121
    Price: 190000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 190000
      Size : 121
      Side: 1
- S4: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 20
    Price: 190000
  Expect:
    Pool: 
      Liquidity: 1908.3847766203
      BaseVirtual: 0
      QuoteVirtual: 705.4259514006
      BaseReal: 449.8118550329
      QuoteReal: 8096.5684094067
      IndexPipRange: 5
      MaxPip: 179999 
      MinPip: 150000 
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 120
    Price: 200000
- S6: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 6
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 103.8268212413
  Expect:
    Pool:
      Liquidity: 893.0705176328
      BaseVirtual: 10
      QuoteVirtual: 103.8268212413
      BaseReal: 204.8844282009
      QuoteReal: 3892.8041358168
      IndexPipRange: 6 
      MaxPip: 209999 
      MinPip: 180000 
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 121
    Price: 220000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 220000
      Size : 121
      Side: 1
- S7.1: CancelLimitOrder
  Action:
    Id: 2
    Price: 190000
    OrderId: 1
- S8: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 10
    Price: 210000
  Expect:
    Pool: 
      Liquidity: 893.0705176328
      BaseVirtual: 0
      QuoteVirtual: 303.5761892003
      BaseReal: 194.8844282009
      QuoteReal: 4092.5535037758
      IndexPipRange: 6
      MaxPip: 209999 
      MinPip: 180000 
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #04", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
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
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 180.3765750184
  Expect:
    Pool:
      Liquidity: 1908.3847766203
      BaseVirtual: 20
      QuoteVirtual: 360.7531500368
      BaseReal: 469.8118550329
      QuoteReal: 7751.8956080428
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 121
    Price: 190000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 190000
      Size : 121
      Side: 1
- S4: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 20
    Price: 190000
  Expect:
    Pool:
      Liquidity: 1908.3847766203
      BaseVirtual: 0
      QuoteVirtual: 705.4259514006
      BaseReal: 449.8118550329
      QuoteReal: 8096.5684094067
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 120
    Price: 200000
- S6: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 6
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 103.8268212413
  Expect:
    Pool:
      Liquidity: 893.0705176328
      BaseVirtual: 10
      QuoteVirtual: 103.8268212413
      BaseReal: 204.8844282009
      QuoteReal: 3892.8041358168
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 121
    Price: 220000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 220000
      Size : 121
      Side: 1
- S7.1: CancelLimitOrder
  Action:
    Id: 2
    Price: 190000
    OrderId: 1
- S8: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 10
    Price: 210000
  Expect:
    Pool:
      Liquidity: 893.0705176328
      BaseVirtual: 0
      QuoteVirtual: 303.5761892003
      BaseReal: 194.8844282009
      QuoteReal: 4092.5535037758
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S9: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 6
    Asset: quote
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      Liquidity: 1187.2538394491
      BaseVirtual: 0
      QuoteVirtual: 403.5761892003
      BaseReal: 259.0806448786
      QuoteReal: 5440.6676343856
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S10: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 120
    Price: 220000
- S10.1: CancelLimitOrder
  Action:
    Id: 2
    Price: 220000
    OrderId: 1
- S11: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 7
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 118.8170248549
  Expect:
    Pool:
      Liquidity: 1101.7892561621
      BaseVirtual: 10
      QuoteVirtual: 118.8170248549
      BaseReal: 234.9022586867
      QuoteReal: 5167.8496911067
      IndexPipRange: 7
      MaxPip: 239999
      MinPip: 210000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S12: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 7
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 118.8170248549
  Expect:
    Pool:
      Liquidity: 2203.5785123241
      BaseVirtual: 20
      QuoteVirtual: 237.6340497099
      BaseReal: 469.8045173733
      QuoteReal: 10335.6993822134
      IndexPipRange: 7
      MaxPip: 239999
      MinPip: 210000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S13: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 11.05574
    Price: 210000
  Expect:
    Pool:
      Liquidity: 2203.5785123241
      BaseVirtual: 31.0557365554
      QuoteVirtual: 0
      BaseReal: 480.8602539287
      QuoteReal: 10098.0653325036
      IndexPipRange: 7
      MaxPip: 239999
      MinPip: 210000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S14: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 13
    Price: 205000
  Expect:
    Pool:
      Liquidity: 1187.2538394491
      BaseVirtual: 3.1398617786
      QuoteVirtual: 338.4289412866
      BaseReal: 262.2205066572
      QuoteReal: 5375.5203864719
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S15: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 10
    Price: 200000
  Expect:
    Pool:
      Liquidity: 1187.2538394491
      BaseVirtual: 6.3973842770
      QuoteVirtual: 272.4691379263
      BaseReal: 265.4780291556
      QuoteReal: 5309.5605831116
      IndexPipRange: 6
      MaxPip: 209999
      MinPip: 180000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #05", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 16500
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    Asset: base
    BaseVirtual: 10
    QuoteVirtual: 0
- S3: OpenLimit
  Action:
    Id: 3
    Asset: base
    Side: 0
    Quantity: 1
    Price: 165000
    Revert: ME_13
    `)
    })
    it ("Case #06", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 176285
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 25.9198215506
    QuoteVirtual: 3418.1259598496
  Expect:
    Pool:
      Liquidity: 10496.1162714114
      BaseVirtual: 25.9198215506
      QuoteVirtual: 3418.1259598496
      BaseReal: 2499.3807019202
      QuoteReal: 44070.5175036251
      IndexPipRange: 5
      MaxPip: 179999 
      MinPip: 150000 
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 7
    BaseVirtual: 7.3563474137
    QuoteVirtual: 0
  Expect:
    Pool:
      Liquidity: 521.9740662434
      BaseVirtual: 7.3563474137
      QuoteVirtual: 0
      BaseReal: 113.9040794935
      QuoteReal: 2391.9856693642
      IndexPipRange: 7
      MaxPip: 239999 
      MinPip: 210000 
- S3: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 30
    Price: 220000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 220000
      Size : 1.4613437980
      Side: 0
- S3.1: Expect
  Pool:
    Liquidity: 521.9740662434
    BaseVirtual: 4.7375127623
    QuoteVirtual: 56.2897171629
    BaseReal: 111.2852448421
    QuoteReal: 2448.2753865271
    IndexPipRange: 7
    MaxPip: 239999 
    MinPip: 210000
    `)
    })
    it ("Case #07", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 3000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 0
    BaseVirtual: 0.1000621543
    QuoteVirtual: 0.0431
  Expect:
    Pool:
      Liquidity: 0.0801528584
      BaseVirtual: 0.1000621543
      QuoteVirtual: 0.0431
      BaseReal: 0.1463384286
      QuoteReal: 0.0439015286
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 0
    BaseVirtual: 0.2500393042
    QuoteVirtual: 0.1077
  Expect:
    Pool:
      Liquidity: 0.2804420196
      BaseVirtual: 0.3501014585
      QuoteVirtual: 0.1508
      BaseReal: 0.5120147340
      QuoteReal: 0.1536044202
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
- S3: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 1
    Price: 5000
- S4: OpenLimit
  Action:
    Id: 2
    Asset: quote
    Side: 0
    Quantity: 0.8
    Price: 5000
  Expect:
    Pool:
      Liquidity: 0.2804420196
      BaseVirtual: 0.2346916321
      QuoteVirtual: 0.1954980336
      BaseReal: 0.3966049075
      QuoteReal: 0.1983024538
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
    `)
    })
    it ("Case #07", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 165000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 5
    BaseVirtual: 100
    QuoteVirtual: 1803.7657501839
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 100
      QuoteVirtual: 1803.7657501839
      BaseReal: 2349.0592751645
      QuoteReal: 38759.4780402140
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 0
    Quantity: 30
    Price: 172000
  Expect:
    Pool:
      Liquidity: 9541.9238831013
      BaseVirtual: 70
      QuoteVirtual: 2305.1692087583
      BaseReal: 2319.0592751645
      QuoteReal: 39260.8814987884
      IndexPipRange: 5
      MaxPip: 179999
      MinPip: 150000
    `)
    })
})
