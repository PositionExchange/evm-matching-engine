import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("MatchingCase31-Case35", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })

    it ("Case #31", async () => {
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
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 57966733.0643528000
      BaseVirtual: 340
      QuoteVirtual: 0
      BaseReal: 2537.8629037561
      QuoteReal: 22840.7661338050
      IndexPipRange: 3
      MaxPip: 119999  
      MinPip: 90000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 1
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
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 285104.7043548640
      BaseVirtual: 40
      QuoteVirtual: 0
      BaseReal: 217.9849782114
      QuoteReal: 1307.9098692682
      IndexPipRange: 2
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 55000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 55000
      Size : 20
      Side: 1
- S6: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 70000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 70000
      Size : 20
      Side: 1
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 20
    QuoteVirtual: 258.7230767
  Expect:
    Pool:
      K: 592873.7056864740
      BaseVirtual: 30
      QuoteVirtual: 388.084615
      BaseReal: 344.3468326227
      QuoteReal: 1721.7341631136
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 36.02500999
  Expect:
    Pool:
      BaseVirtual: 13.9749900083
      QuoteVirtual: 472.1204764033
      BaseReal: 328.3218226310
      QuoteReal: 1805.7700244703
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 58000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 58000
      Size : 20
      Side: 1
- S10: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 337.8324250138
  Expect:
    Pool:
      K: 1744922.1159909200
      BaseVirtual: 23.9749900083
      QuoteVirtual: 809.9529014171
      BaseReal: 563.2571051871
      QuoteReal: 3097.9140785293
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S11: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 1140418.8174194600
      BaseVirtual: 80
      QuoteVirtual: 0
      BaseReal: 435.9699564227
      QuoteReal: 2615.8197385364
      IndexPipRange: 2
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S12: OpenLimit
  Action:
    Id: 1
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
- S13: OpenLimit
  Action:
    Id: 1
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
- S14: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 34.7603953628
  Expect:
    Pool:
      BaseVirtual: 9.2145946454
      QuoteVirtual: 893.3197399
      BaseReal: 548.4967098243
      QuoteReal: 3181.2809169810
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S15: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 10
    QuoteVirtual: 969.4617877879
  Expect:
    Pool:
      K: 7587278.5888238000
      BaseVirtual: 19.2145946454
      QuoteVirtual: 1862.7815276566
      BaseReal: 1143.7444998039
      QuoteReal: 6633.7180988627
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S16: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 231866932.2574110000
      BaseVirtual: 680
      QuoteVirtual: 0
      BaseReal: 5075.7258075122
      QuoteReal: 45681.5322676101
      IndexPipRange: 3
      MaxPip: 119999  
      MinPip: 90000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S17: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 2565942.3391937800
      BaseVirtual: 120
      QuoteVirtual: 0
      BaseReal: 653.9549346341
      QuoteReal: 3923.7296078046
      IndexPipRange: 2
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S18: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 40
  Expect:
    Pool:
      BaseVirtual: 99.2145946454
      QuoteVirtual: 128.8064359206
      BaseReal: 633.1695292795
      QuoteReal: 4052.5360437252
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S19: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 51.9304388153
  Expect:
    Pool:
      K: 5052022.8074817600
      BaseVirtual: 139.2145946454
      QuoteVirtual: 180.7368747359
      BaseReal: 888.4422667401
      QuoteReal: 5686.3827809753
      IndexPipRange: 2
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S20: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 159.2145946
  Expect:
    Pool:
      BaseVirtual: 0
      QuoteVirtual: 1237.3282198459
      BaseReal: 749.2276720947
      QuoteReal: 6742.9741260852
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S21: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 300
  Expect:
    Pool:
      BaseVirtual: 400
      QuoteVirtual: 2667.1310138071
      BaseReal: 4795.7258075122
      QuoteReal: 48348.6632814171
      IndexPipRange: 3  
      MaxPip: 119999  
      MinPip: 90000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S22: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 1976.1304067544
    BaseReal: 1124.5299051585
    QuoteReal: 6747.0669779604
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S23: Expect
  Pool:
    BaseVirtual: 0
    QuoteVirtual: 1237.3282198459
    BaseReal: 749.2276720947
    QuoteReal: 6742.9741260852
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #32", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 80000
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 19429.1959951070
      BaseVirtual: 0
      QuoteVirtual: 100
      BaseReal: 56.9056526490
      QuoteReal: 341.4282253286
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S2: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 340
    QuoteVirtual: 6372.410774
  Expect:
    Pool:
      K: 282795585.5366000000
      BaseVirtual: 340
      QuoteVirtual: 6372.410774
      BaseReal: 5945.5401934622
      QuoteReal: 47564.3215476979
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 10000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 10000
      Size : 20
      Side: 0
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 539.5454830818
      BaseVirtual: 0
      QuoteVirtual: 40
      BaseReal: 13.4107603946
      QuoteReal: 40.2322811837
      IndexPipRange: 0
      MaxPip: 30000  
      MinPip: 1 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 70000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 70000
      Size : 20
      Side: 0
- S6: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 20
    Price: 65000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 65000
      Size : 20
      Side: 0
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 20
    QuoteVirtual: 374.8476926
  Expect:
    Pool:
      K: 317044185.8611020000
      BaseVirtual: 360
      QuoteVirtual: 6747.258466
      BaseReal: 6295.2778519012
      QuoteReal: 50362.2228152096
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 454.6572556304
  Expect:
    Pool:
      BaseVirtual: 794.6572556304
      QuoteVirtual: 3494.5814036973
      BaseReal: 6729.9351075316
      QuoteReal: 47109.5457527210
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: OpenLimit
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
- S10: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 10
    QuoteVirtual: 43.97595792
  Expect:
    Pool:
      K: 325073786.8549900000
      BaseVirtual: 804.6572556304
      QuoteVirtual: 3538.5573616205
      BaseReal: 6814.6248912068
      QuoteReal: 47702.3742384478
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S11: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 40
  Expect:
    Pool:
      K: 2158.1819323274
      BaseVirtual: 0
      QuoteVirtual: 80
      BaseReal: 26.8215207891
      QuoteReal: 80.4645623674
      IndexPipRange: 0  
      MaxPip: 30000  
      MinPip: 1 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S12: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 277.2455703
  Expect:
    Pool:
      BaseVirtual: 1061.9028258959
      QuoteVirtual: 1803.3411227427
      BaseReal: 7071.8704614723
      QuoteReal: 45967.1579995700
      IndexPipRange: 2  
      MaxPip: 89999  
      MinPip: 60000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S13: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    BaseVirtual: 10
    QuoteVirtual: 16.98216709
  Expect:
    Pool:
      K: 331225091.8174800000
      BaseVirtual: 1071.9028258959
      QuoteVirtual: 1820.3232898371
      BaseReal: 7138.4666724345
      QuoteReal: 46400.0333708244
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S14: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 0
    BaseVirtual: 0
    QuoteVirtual: 340
  Expect:
    Pool:
      K: 59484.8895097733
      BaseVirtual: 0
      QuoteVirtual: 420
      BaseReal: 140.8129841430
      QuoteReal: 422.4389524290
      IndexPipRange: 0 
      MaxPip: 30000  
      MinPip: 1 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S15: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 400
  Expect:
    Pool:
      K: 485729.8998776760
      BaseVirtual: 0
      QuoteVirtual: 500
      BaseReal: 284.5282632449
      QuoteReal: 1707.1411266430
      IndexPipRange: 1 
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S16: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 300
  Expect:
    Pool:
      BaseVirtual: 8.5149922700
      QuoteVirtual: 450.3953999160
      BaseReal: 293.0432555149
      QuoteReal: 1657.5365265591
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S17: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 1
    BaseVirtual: 40
    QuoteVirtual: 2115.775966
  Expect:
    Pool:
      K: 15768059.6771385000
      BaseVirtual: 48.5149922700
      QuoteVirtual: 2566.1713660505
      BaseReal: 1669.6422997587
      QuoteReal: 9443.9747240577
      IndexPipRange: 1 
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S18: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 335.8085103307
  Expect:
    Pool:
      BaseVirtual: 364.3235026007
      QuoteVirtual: 1063.9998823503
      BaseReal: 1985.4508100894
      QuoteReal: 7941.8032403576
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S19: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 607.1503092464
  Expect:
    Pool:
      BaseVirtual: 103.0822587581
      QuoteVirtual: 138.9181153
      BaseReal: 420.8129841430
      QuoteReal: 141.3570677505
      IndexPipRange: 0  
      MaxPip: 30000  
      MinPip: 1  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S20: Expect
  Pool:
    BaseVirtual: 671.4738118471
    QuoteVirtual: 0
    BaseReal: 2292.6011193357
    QuoteReal: 6877.8033580072
    IndexPipRange: 1
    MaxPip: 59999
    MinPip: 30000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S21: Expect
  Pool:
    BaseVirtual: 1363.3878336259
    QuoteVirtual: 0
    BaseReal: 7429.9516801645
    QuoteReal: 44579.7100809873
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #33", async () => {
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
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 20598814.8896389000
      BaseVirtual: 340
      QuoteVirtual: 0
      BaseReal: 1852.8723147966
      QuoteReal: 11117.2338887798
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 60000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 60000
      Size : 20
      Side: 1
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 25730699.5680265000
      BaseVirtual: 380
      QuoteVirtual: 0
      BaseReal: 2070.8572930080
      QuoteReal: 12425.143758
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 80000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 80000
      Size : 20
      Side: 1
- S6: OpenLimit
  Action:
    Id: 1
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
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 20
    QuoteVirtual: 258.7230767
  Expect:
    Pool:
      K: 592873.7056864740
      BaseVirtual: 30
      QuoteVirtual: 388.084615
      BaseReal: 344.3468326227
      QuoteReal: 1721.7341631136
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 50
  Expect:
    Pool:
      BaseVirtual: 0
      QuoteVirtual: 552.4000129860
      BaseReal: 314.3468326227
      QuoteReal: 1886.0495610530
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 826956.6640816640
      BaseVirtual: 0
      QuoteVirtual: 652.4000129860
      BaseReal: 371.252485
      QuoteReal: 2227.4777863816
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S10: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 802307.7240740880
      BaseVirtual: 40
      QuoteVirtual: 0
      BaseReal: 298.5721063242
      QuoteReal: 2687.1489569182
      IndexPipRange: 3
      MaxPip: 119999  
      MinPip: 90000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S11: OpenLimit
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
- S12: OpenLimit
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
- S13: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 193.7734391935
  Expect:
    Pool:
      BaseVirtual: 153.7734391935
      QuoteVirtual: 0
      BaseReal: 525.0259244652
      QuoteReal: 1575.0777733957
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S14: Expect
  Pool:
    BaseVirtual: 40
    QuoteVirtual: 0
    BaseReal: 298.5721063242
    QuoteReal: 2687.148957
    IndexPipRange: 3
    MaxPip: 119999
    MinPip: 90000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
- S15: Expect
  Pool:
    BaseVirtual: 360
    QuoteVirtual: 121.1702423217
    BaseReal: 2050.8572930080
    QuoteReal: 12546.3140003697
    IndexPipRange: 2
    MaxPip: 89999
    MinPip: 60000
    FeeGrowthBase: 0
    FeeGrowthQuote: 0
    `)
    })
    it ("Case #34", async () => {
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
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 340
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 20598814.8896389000
      BaseVirtual: 340
      QuoteVirtual: 0
      BaseReal: 1852.8723147966
      QuoteReal: 11117.233889
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S3: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 60000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 60000
      Size : 20
      Side: 1
- S4: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 2
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 25730699.5680265000
      BaseVirtual: 380
      QuoteVirtual: 0
      BaseReal: 2070.8572930080
      QuoteReal: 12425.143758
      IndexPipRange: 2 
      MaxPip: 89999  
      MinPip: 60000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S5: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 20
    Price: 80000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 80000
      Size : 20
      Side: 1
- S6: OpenLimit
  Action:
    Id: 1
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
- S7: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 20
    QuoteVirtual: 258.7230767
  Expect:
    Pool:
      K: 592873.7056864740
      BaseVirtual: 30
      QuoteVirtual: 388.084615
      BaseReal: 344.3468326227
      QuoteReal: 1721.7341631136
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S8: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 50
  Expect:
    Pool:
      BaseVirtual: 0
      QuoteVirtual: 552.4000129860
      BaseReal: 314.3468326227
      QuoteReal: 1886.0495610530
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S9: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 0
    QuoteVirtual: 100
  Expect:
    Pool:
      K: 826956.6640816640
      BaseVirtual: 0
      QuoteVirtual: 652.4000129860
      BaseReal: 371.252485
      QuoteReal: 2227.4777863816
      IndexPipRange: 1
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S10: AddLiquidity
  Action:
    Id: 2
    IndexPipRange: 3
    BaseVirtual: 40
    QuoteVirtual: 0
  Expect:
    Pool:
      K: 802307.7240740880
      BaseVirtual: 40
      QuoteVirtual: 0
      BaseReal: 298.5721063242
      QuoteReal: 2687.148957
      IndexPipRange: 3
      MaxPip: 119999  
      MinPip: 90000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S11: OpenLimit
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
- S12: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 193.7734391935
  Expect:
    Pool:
      BaseVirtual: 153.7734391935
      QuoteVirtual: 0
      BaseReal: 525.0259244652
      QuoteReal: 1575.0777733957
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    `)
    })
    it ("Case #35", async () => {
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
- S2: OpenLimit
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
- S3: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 1000
    Price: 41000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 41000
      Size : 1000
      Side: 0
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 2000
    Price: 42000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 42000
      Size : 2000
      Side: 0
- S5: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 140
    Price: 43000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 43000
      Size : 140
      Side: 0
- S6: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 1400
    Price: 45000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 45000
      Size : 1400
      Side: 0
- S7: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 523.3
    Price: 35000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 35000
      Size : 523.3
      Side: 0
- S8: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 52
    Price: 30000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 30000
      Size : 52
      Side: 0
- S9: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 0
    Quantity: 512
    Price: 32100
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 32100
      Size : 512
      Side: 0
- S10: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 434
    Price: 50000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 50000
      Size : 434
      Side: 1
- S11: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 1
    BaseVirtual: 20
    QuoteVirtual: 258.7230766977
  Expect:
    Pool:
      K: 592873.7056864740
      BaseVirtual: 30
      QuoteVirtual: 388.0846150465
      BaseReal: 344.3468326227
      QuoteReal: 1721.7341631136
      IndexPipRange: 1 
      MaxPip: 59999  
      MinPip: 30000 
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S12: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 454
    Price: 51000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 51000
      Size : 454
      Side: 1
- S13: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 345
    Price: 52000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 52000
      Size : 345
      Side: 1
- S14: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 467
    Price: 54000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 54000
      Size : 467
      Side: 1
- S15: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 512
    Price: 58000
  Expect:
    PendingOrder:
      OrderId: 1
      Price: 58000
      Size : 512
      Side: 1
- S16: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 1000
  Expect:
    Pool:
      BaseVirtual: 23.3130171825
      QuoteVirtual: 422.1816709200
      BaseReal: 337.6598498052
      QuoteReal: 1755.8312189871
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S17: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 100
  Expect:
    Pool:
      BaseVirtual: 23.3130171825
      QuoteVirtual: 422.1816709200
      BaseReal: 337.6598498052
      QuoteReal: 1755.8312189871
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S18: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 1200
  Expect:
    Pool:
      BaseVirtual: 48.6265994281
      QuoteVirtual: 299.7308961618
      BaseReal: 362.9734320508
      QuoteReal: 1633.3804442288
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S19: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 1
    Quantity: 1500
  Expect:
    Pool:
      BaseVirtual: 61.3663639992
      QuoteVirtual: 244.3458777448
      BaseReal: 375.7131966219
      QuoteReal: 1577.9954258119
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
- S20: OpenMarket
  Action:
    id: 3
    asset: base
    Side: 0
    Quantity: 1000
  Expect:
    Pool:
      BaseVirtual: 5.3711750476
      QuoteVirtual: 520.7148964210
      BaseReal: 319.7180076704
      QuoteReal: 1854.3644444881
      IndexPipRange: 1  
      MaxPip: 59999  
      MinPip: 30000  
      FeeGrowthBase: 0  
      FeeGrowthQuote: 0
    `)
    })

})
