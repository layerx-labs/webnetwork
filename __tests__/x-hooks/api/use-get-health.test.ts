import { useGetHealth } from "x-hooks/api/use-get-health";

const getMock = jest.fn();

jest.mock("services/api", () => ({
  api: {
    get: async () => getMock()
  }
}));

describe("useGetHealth", () => {
  it("Should return 200 if server response is 200", async () => {
    getMock.mockResolvedValue({ status: 200 })
    const response = await useGetHealth();
    expect(response.status).toBe(200);
  });
});