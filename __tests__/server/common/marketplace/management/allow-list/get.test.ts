import { NextApiRequest } from "next";

import Database from "db/models";

import { AllowListTypes } from "interfaces/enums/marketplace";

import get from "server/common/marketplace/management/allow-list/get";
import { ErrorMessages } from "server/errors/error-messages";
import { HttpBadRequestError } from "server/errors/http-errors";

import { isAddress } from "__mocks__/web3-utils";

jest.mock("db/models", () => ({
  network: {
    findOne: jest.fn(async (props) => ({
      allow_list: ["0x01234"],
      close_task_allow_list: ["0x01234"]
    }))
  }
}));

describe("marketplace/management/allow-list#get", () => {
  let mockedRequest: NextApiRequest;

  beforeEach(() => {
    mockedRequest = {
      query: {
        networkId: 1,
        type: AllowListTypes.OPEN_TASK
      }
    } as unknown as NextApiRequest;
    jest.clearAllMocks();
  });

  it("Should get allow list", async () => {
    const result = await get(mockedRequest);
    expect(result.includes("0x01234")).toBe(true);
  });

  it("Should check if address is allowed", async () => {
    mockedRequest.query.address = "0x01234";
    const result = await get(mockedRequest);
    expect(result.allowed).toBe(true);
  });

  it("Should throw because networkId was not provided", async () => {
    mockedRequest.query.networkId = null;
    await expect(() => get(mockedRequest))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because type was not provided", async () => {
    mockedRequest.query.type = null;
    await expect(() => get(mockedRequest))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because type is invalid", async () => {
    mockedRequest.query.type = "invalid-type";
    await expect(() => get(mockedRequest))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because address was provided but is invalid", async () => {
    isAddress
      .mockReturnValueOnce(false);
    mockedRequest.query.address = "0x0000";
    await expect(() => get(mockedRequest))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because network was not found", async () => {
    Database.network.findOne
      .mockReturnValueOnce(null);
    await expect(() => get(mockedRequest))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.NoNetworkFound));
  });
});