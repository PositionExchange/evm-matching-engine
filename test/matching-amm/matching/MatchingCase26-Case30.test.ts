import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase26-Case30", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #26", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 110000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 110000
      Size : 20
      Side: 1
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
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 3269.774673
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 4577.684542
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 455
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 103811097.8602740000
      BaseVirtual: 455
      QuoteVirtual: 0
      BaseReal: 3396.2577094383
      QuoteReal: 30566.3193849450
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 795
      QuoteVirtual: 0
      BaseReal: 5934.1206131945
      QuoteReal: 53407.0855187500
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 620.1924750244
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 354.8075249756
      QuoteVirtual: 4279.1599320354
      BaseReal: 5493.9281381700
      QuoteReal: 57686.2454507854
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S9: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 736.5333506
    BaseReal: 419.1291101636
    QuoteReal: 2514.7327480707
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S10: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 1028.7799764770
    BaseReal: 622.9474237398
    QuoteReal: 5606.4645189157
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #27", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 80000
- S1: OpenLimit
  Action:
    Id: 2
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
    IndexPipRange: 2
    BaseVirtual: 10
    QuoteVirtual: 187.4238463
  Expect:
    Pool:
      K: 244632.8594607270
      BaseVirtual: 10
      QuoteVirtual: 187.4238463
      BaseReal: 174.8688292195
      QuoteReal: 1398.9506337558
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 30
    QuoteVirtual: 562.2715388
  Expect:
    Pool:
      K: 3914125.7513716300
      BaseVirtual: 40
      QuoteVirtual: 749.6953851
      BaseReal: 699.4753168779
      QuoteReal: 5595.8025350233
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
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
      BaseReal: 33.526901
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
- S6: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 300
  Expect:
    Pool:
      K: 174862.7639559630
      BaseVirtual: 0
      QuoteVirtual: 300
      BaseReal: 170.7169579469
      QuoteReal: 1024.2846759858
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 50
  Expect:
    Pool:
      K: 238007.6509400610
      BaseVirtual: 0
      QuoteVirtual: 350
      BaseReal: 199.1697842714
      QuoteReal: 1194.9987886501
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 90
  Expect:
    Pool:
      K: 376149.2344652720
      BaseVirtual: 0
      QuoteVirtual: 440
      BaseReal: 250.3848716555
      QuoteReal: 1502.2841914459
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S9: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 266.2796102164
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 34.3605432859
      QuoteVirtual: 80.4867851648
      BaseReal: 81.2970593155
      QuoteReal: 81.2997693078
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S10: Expect
  Pool:
    BaseVirtual: 103.7098588265
    QuoteVirtual: 0
    BaseReal: 354.0947304820
    QuoteReal: 1062.2841914459
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S11: Expect
  Pool:
    BaseVirtual: 148.2092081040
    QuoteVirtual: 0
    BaseReal: 807.6845249819
    QuoteReal: 4846.1071498915
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #28", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 110000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 110000
      Size : 20
      Side: 1
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
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 3269.7746731705
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 4577.6845424387
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 455
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 103811097.8602740000
      BaseVirtual: 455
      QuoteVirtual: 0
      BaseReal: 3396.2577094383
      QuoteReal: 30566.3193849450
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 795
      QuoteVirtual: 0
      BaseReal: 5934.1206131945
      QuoteReal: 53407.0855187500
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 884.4905055835
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 110.5094944165
      QuoteVirtual: 6963.6607187756
      BaseReal: 5249.6301076109
      QuoteReal: 60370.7462375256
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S9: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 736.5333506
    BaseReal: 419.1291101636
    QuoteReal: 2514.7327480707
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S10: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 1028.7799764770
    BaseReal: 622.9474237398
    QuoteReal: 5606.4645189157
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #29", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 80000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 10
    QuoteVirtual: 187.4238463
  Expect:
    Pool:
      K: 244632.8594607270
      BaseVirtual: 10
      QuoteVirtual: 187.4238463
      BaseReal: 174.8688292195
      QuoteReal: 1398.9506337558
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S2: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 30
    QuoteVirtual: 562.2715388
  Expect:
    Pool:
      K: 3914125.7513716300
      BaseVirtual: 40
      QuoteVirtual: 749.6953851
      BaseReal: 699.4753168779
      QuoteReal: 5595.8025350233
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
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
- S4: AddLiquidity
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
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 300
  Expect:
    Pool:
      K: 174862.7639559630
      BaseVirtual: 0
      QuoteVirtual: 300
      BaseReal: 170.7169579469
      QuoteReal: 1024.2846759858
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 50
  Expect:
    Pool:
      K: 238007.6509400610
      BaseVirtual: 0
      QuoteVirtual: 350
      BaseReal: 199.1697842714
      QuoteReal: 1194.9987886501
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 90
  Expect:
    Pool:
      K: 376149.2344652720
      BaseVirtual: 0
      QuoteVirtual: 440
      BaseReal: 250.3848716555
      QuoteReal: 1502.2841914459
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 250
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 38.0809330695
      QuoteVirtual: 76.9280348713
      BaseReal: 85.0185944505
      QuoteReal: 77.7410190143
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #30", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 50000
- S1: AddLiquidity
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
- S2: AddLiquidity
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
- S3: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 100
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1781904.4022179000
      BaseVirtual: 100
      QuoteVirtual: 0
      BaseReal: 544.9624455284
      QuoteReal: 3269.7746731705
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 3492532.6283470900
      BaseVirtual: 140
      QuoteVirtual: 0
      BaseReal: 762.9474237398
      QuoteReal: 4577.6845424387
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 455
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 103811097.8602740000
      BaseVirtual: 455
      QuoteVirtual: 0
      BaseReal: 3396.2577094383
      QuoteReal: 30566.3193849450
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 795
      QuoteVirtual: 0
      BaseReal: 5934.1206131945
      QuoteReal: 53407.0855187500
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 600
  Expect:
    Pool:
      K: 316924087.0674530000
      BaseVirtual: 375
      QuoteVirtual: 4067.9153561134
      BaseReal: 5514.1206131945
      QuoteReal: 57475.0008748634
      IndexPipRange: 3
      MaxPip: 119999
      MinPip: 90000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 736.5333506
    BaseReal: 419.1291101636
    QuoteReal: 2514.7327480707
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S9: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 1028.7799764770
    BaseReal: 622.9474237398
    QuoteReal: 5606.4645189157
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
})
