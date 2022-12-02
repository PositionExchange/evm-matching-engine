import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase11_Case15", async function(){
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
    Quantity: 2
  Expect:
    Pool:
      K: 0
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
    it ("Case #12", async () => {
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
    Price: 60000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 60000
      Size : 10
      Side: 1
- S2: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 2
  Expect:
    Pool:
      K: 0
      BaseVirtual: 0
      QuoteVirtual: 0
      BaseReal: 0
      QuoteReal: 0
      IndexPipRange: 1
      MaxPip: 0
      MinPip: 0
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S3: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 2
    BaseVirtual: 15
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 40092.8490499028
      BaseVirtual: 15
      QuoteVirtual: 43.80559127
      BaseReal: 81.7443668293
      QuoteReal: 490.4662009756
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S4: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 14
  Expect:
    Pool:
      K: 40092.8490499028
      BaseVirtual: 9
      QuoteVirtual: 38.8516972158
      BaseReal: 75.7443668293
      QuoteReal: 529.3178981914
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S5: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 9
  Expect:
    Pool:
      K: 40092.8490499028
      BaseVirtual: 0
      QuoteVirtual: 110.2264260511
      BaseReal: 66.7443668293
      QuoteReal: 600.6926270267
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 3.1
  Expect:
    Pool:
      K: 40092.8490499028
      BaseVirtual: 3.1
      QuoteVirtual: 83.5650469261
      BaseReal: 69.8443668293
      QuoteReal: 574.0312479017
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 11.8
  Expect:
    Pool:
      K: 40092.8490499028
      BaseVirtual: 15
      QuoteVirtual: 0
      BaseReal: 81.7443668293
      QuoteReal: 490.4662009756
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S8: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 15
  Expect:
    Pool:
      K: 437.1569098899
      BaseVirtual: 0
      QuoteVirtual: 15
      BaseReal: 8.5358478973
      QuoteReal: 51.2142337993
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S9: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 10
    Price: 59999
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 59999
      Size : 10
      Side: 0
- S10: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 13
  Expect:
    Pool:
      K: 437.1569098899
      BaseVirtual: 3
      QuoteVirtual: 1.6812823153
      BaseReal: 11.5358478973
      QuoteReal: 37.8955161146
      IndexPipRange: 1
      MaxPip: 59999
      MinPip: 30000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S11: Expect
  Pool:
    BaseVirtual: 15
    QuoteVirtual: 0
    BaseReal: 81.6443668293
    QuoteReal: 490.4662009756
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #13", async () => {
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
- S2: OpenLimit
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
- S3: AddLiquidity
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
- S4: AddLiquidity
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
- S5: AddLiquidity
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
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 171.1385881425
  Expect:
    Pool:
      K: 3372.1592692615
      BaseVirtual: 7.5345658318
      QuoteVirtual: 81.54173805
      BaseReal: 41.0612156661
      QuoteReal: 82.1251688378
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #14", async () => {
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
    Price: 60000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 60000
      Size : 10
      Side: 1
- S2: OpenLimit
  Action:
    Id: 2
    Asset: base
    Side: 1
    Quantity: 20
    Price: 100000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 100000
      Size : 20
      Side: 1
- S3: AddLiquidity
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
- S4: AddLiquidity
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
- S5: AddLiquidity
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
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 160
  Expect:
    Pool:
      K: 1781904.4022179000
      BaseVirtual: 0
      QuoteVirtual: 734.8428403407
      BaseReal: 444.9624455284
      QuoteReal: 4004.6175135112
      IndexPipRange: 2
      MaxPip: 89999
      MinPip: 60000
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 736.5543070162
    BaseReal: 419.1291101636
    QuoteReal: 2514.7537044389
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #15", async () => {
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
- S6: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 154.1530209811
  Expect:
    Pool:
      K: 6609.4321677526
      BaseVirtual: 10.5489986705
      QuoteVirtual: 114.1603359600
      BaseReal: 57.4866600515
      QuoteReal: 114.9733201030
      IndexPipRange: 0
      MaxPip: 30000
      MinPip: 1
      FeeGrowthBase: 0
      FeeGrowthQuote: 0
- S7: Expect
  Pool:
    BaseVirtual: 173.6040223106
    QuoteVirtual: 0
    BaseReal: 592.7331324742
    QuoteReal: 1778.1993974227
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })

})
