import get from "server/common/health/get";

describe("server/common/health/get", () => {
  it("Should return true", async () => {
    const result = await get(null);
    expect(result).toBe(true);
  });
});