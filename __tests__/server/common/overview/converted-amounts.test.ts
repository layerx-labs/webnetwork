import cache from "memory-cache";

import get from "server/common/overview/converted-amounts";

jest.mock("memory-cache");
jest.mock("server/common/check-prices/post", () => async () => {});
jest.mock("db/models", () => ({
  tokens: {
    findAll: jest.fn(() => [
      {address: "0x000", chain_id: 1},
      {address: "0x123", chain_id: 2},
      {address: "0x456", chain_id: 3},
    ])
  },
  issue: {
    scope: jest.fn((scope) => ({
      findAll: jest.fn((props) => {
        if (props?.include?.length === 1)
          return [
            { amount: 100, transactionalToken: { last_price_used: { usd: 1 } }},
            { amount: 50, transactionalToken: { last_price_used: { usd: 1 } }},
          ];
        return [
          { amount: 100, transactionalToken: { last_price_used: { usd: 1 } }},
        ];
      })
    }))
  }
}));

describe("ConvertedAmountsOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("Should get the converted value of all issues because no filters is passed", async () => {
    const converted = await get({});
    expect(converted.totalOnTasks).toBe(150);
  });

  it("Should get the converted value of issues filtered by network", async () => {
    const converted = await get({ network: "network1" });
    expect(converted.totalOnTasks).toBe(100);
  });

  it("Should get the converted value of issues filtered by chain", async () => {
    const converted = await get({ chain: "chain1" });
    expect(converted.totalOnTasks).toBe(100);
  });

  it("Should get cached data", async () => {
    const modelsMock = jest.requireMock("db/models");
    jest
      .spyOn(cache, "get")
      .mockImplementationOnce(() => true);
    await get({});
    expect(modelsMock.tokens.findAll).not.toHaveBeenCalled();
  });

  it("Should get updated data", async () => {
    const modelsMock = jest.requireMock("db/models");
    await get({});
    expect(modelsMock.tokens.findAll).toHaveBeenCalled();
  });

  it("Should save cache", async () => {
    const cacheSpy = jest.spyOn(cache, "put");
    await get({});
    expect(cacheSpy).toHaveBeenCalled();
  });
});