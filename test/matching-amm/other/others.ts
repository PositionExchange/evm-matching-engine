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
})
