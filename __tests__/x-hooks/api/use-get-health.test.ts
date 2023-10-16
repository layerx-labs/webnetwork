import { useGetHealth } from "x-hooks/api/use-get-health";

describe("UseGetHealth", () => {
  it("Should return 200", async () => {
    const response = await useGetHealth();
    expect(response.status).toBe(200);
  });
});