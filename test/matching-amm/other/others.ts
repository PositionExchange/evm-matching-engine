import {deployAndCreateRouterHelper, TestMatchingAmm} from "../test-matching-amm";

describe("OtherCases", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("OpenMarketWithQuote", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 69900
- S1: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 10
    Price: 70000
  Expect:
    PendingOrder: 
      OrderId: 1
      Price: 70000
      Size : 10
      Side: 1
- S3: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 0
    Quantity: 1
    `)
    })
    it ("OpenMarketWithQuote-2", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action:
    Price: 170000
- S1: AddLiquidity
  Action:
    Id: 3
    IndexPipRange: 5
    BaseVirtual: 0.2704430339572
    QuoteVirtual: 9.9
- S2: OpenLimit
  Action:
    Id: 1
    Asset: quote
    Side: 0
    Quantity: 50
    Price: 150000
- S3: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 1
    Quantity: 10
- S4: OpenLimit
  Action:
    Id: 1
    Asset: base
    Side: 1
    Quantity: 100
    Price: 179999
- S5: OpenMarket
  Action:
    id: 2
    asset: quote
    Side: 0
    Quantity: 10
    `)
    })
})


describe("ReproduceManualCHZ", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Add CHZ", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 33757
- S1: AddLiquidity
  Action:
    Id: 1
    IndexPipRange: 2
    Asset: base
    BaseVirtual: 1000000
    QuoteVirtual: 0
`)
    })
})
describe("ReproduceManualNoLiquidity", async function(){
    let testHelper: TestMatchingAmm

    beforeEach(async () => {
        testHelper = await deployAndCreateRouterHelper()
    })
    it ("Open with base", async () => {
        return testHelper.process(`
- S0: SetCurrentPrice
  Action: 
    Price: 10000
- S1: OpenMarket
  Action:
    id: 2
    asset: base
    Side: 0
    Quantity: 10
`)
    })
})
