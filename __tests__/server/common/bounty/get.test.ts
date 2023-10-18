import { NextApiRequest } from "next";

import { get } from "server/common/bounty";
import { HttpBadRequestError } from "server/errors/http-errors";

jest.mock("services/ipfs-service");
jest.mock("helpers/chain-from-header");
jest.mock("db/models", () => ({
  issue: {
    findOne: jest.fn().mockImplementation(() => ({ id: 1 }))
  },
  chain: {
    findOne: jest.fn()
  }
}));

describe("server/common/bounty/get", () => {
  it("Should throw if ids are not provided", async () => {
    const request = {
      query: {
      }
    } as unknown as NextApiRequest;
    await expect(() => get(request)).rejects.toThrow(new HttpBadRequestError("Missing params"));
  });

  it("Should get issue without filter network and chain", async () => {
    const request = {
      query: {
        ids: ["1"]
      }
    } as unknown as NextApiRequest;
    const output = await get(request);
    console.log(output)
  });
});