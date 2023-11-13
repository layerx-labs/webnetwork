import { NextApiRequest } from "next";

import { get } from "server/common/task";
import { HttpBadRequestError } from "server/errors/http-errors";

jest.mock("services/ipfs-service");
jest.mock("helpers/chain-from-header");
jest.mock("db/models", () => ({
  issue: {
    findOne: jest.fn().mockImplementation(() => ({ 
      id: 1,
      dataValues: {
      },
      network: {
        mergeCreatorFeeShare: 1,
        proposerFeeShare: 1,
        chain: {
          closeFeePercentage: 1
        }
      }
    }))
  },
  chain: {
    findOne: jest.fn()
  }
}));
jest.mock("helpers/calculateDistributedAmounts", () => ({
  getDeveloperAmount: () => jest.fn().mockReturnValue(0)
}));

describe("server/common/bounty/get", () => {
  it("Should throw if ids are not provided", async () => {
    const request = {
      query: {
      }
    } as unknown as NextApiRequest;
    await expect(() => get(request)).rejects.toThrow(new HttpBadRequestError("Missing params"));
  });

  it("Should get issue", async () => {
    const request = {
      query: {
        ids: ["1", "network", "chain"]
      }
    } as unknown as NextApiRequest;
    const output = await get(request);
    expect(output.id).toBe(1);
  });
});