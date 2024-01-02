import Database from "db/models";

import { updateAllowListByType } from "helpers/api/marketplace/management/update-allow-list";
import { getAllowListColumnFromType } from "helpers/marketplace";

import { AllowListTypes } from "interfaces/enums/marketplace";

import { ErrorMessages } from "server/errors/error-messages";
import { HttpBadRequestError } from "server/errors/http-errors";

import { isAddress } from "__mocks__/web3-utils";

jest.mock("db/models", () => ({
  network: {
    findOne: jest.fn(async (props) => ({
      allow_list: [],
      close_task_allow_list: []
    })),
    update: jest.fn(async (values, condition) => ([true, {
      allow_list: ["0x194EA394D10e014D79dB10607ACFCAfF299d0dfa"],
      close_task_allow_list: ["0x194EA394D10e014D79dB10607ACFCAfF299d0dfa"]
    }]))
  }
}));

const networkId = 1;
const address = "0x194EA394D10e014D79dB10607ACFCAfF299d0dfa";
const invalidAddress = "0x1234";
const updateCondition = {
  where: {
    id: networkId
  },
  returning: true
};
const types = Object.values(AllowListTypes);

describe("updateAllowListByType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  types
    .forEach(type => {
      it(`Should add address to ${type} list successfully`, async () => {
        const listColumn = getAllowListColumnFromType(type);
        const result = await updateAllowListByType(address, networkId, type, "add");
        const updateSpy = jest.spyOn(Database.network, "update");
        expect(updateSpy).toHaveBeenCalledWith({
          [listColumn]: [address]
        }, updateCondition);
        expect(result.includes(address)).toBe(true);
      });

      it(`Should remove address from ${type} list successfully`, async () => {
        Database.network.findOne
          .mockReturnValueOnce(({
            allow_list: [address],
            close_task_allow_list: [address],
          }));
        Database.network.update
          .mockReturnValueOnce(([true, {
            allow_list: [],
            close_task_allow_list: [],
          }]));
        const listColumn = getAllowListColumnFromType(type);
        const result = await updateAllowListByType(address, networkId, type, "remove");
        const updateSpy = jest.spyOn(Database.network, "update");
        expect(updateSpy).toHaveBeenCalledWith({
          [listColumn]: []
        }, updateCondition);
        expect(result.includes(address)).toBe(false);
      });
    });

  it("Should throw because address was not provided", async () => {
    await expect(() => updateAllowListByType(undefined, networkId, AllowListTypes.OPEN_TASK, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because address is invalid", async () => {
    isAddress
      .mockReturnValueOnce(false);
    await expect(() => updateAllowListByType(invalidAddress, networkId, AllowListTypes.OPEN_TASK, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because networkId was not provided", async () => {
    await expect(() => updateAllowListByType(address, undefined, AllowListTypes.OPEN_TASK, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because type was not provided", async () => {
    await expect(() => updateAllowListByType(address, networkId, undefined, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because list type is invalid", async () => {
    // @ts-ignore
    await expect(() => updateAllowListByType(address, networkId, "invalid-type", "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.InvalidPayload));
  });

  it("Should throw because network was not found", async () => {
    Database.network.findOne
      .mockReturnValueOnce(null);
    await expect(() => updateAllowListByType(address, networkId, AllowListTypes.OPEN_TASK, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.NetworkNotFound));
  });

  it("Should throw because is trying to allow an already allowed address", async () => {
    Database.network.findOne
      .mockReturnValueOnce(({
        allow_list: [address],
        close_task_allow_list: []
      }));
    await expect(() => updateAllowListByType(address, networkId, AllowListTypes.OPEN_TASK, "add"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.UserAllowed));
  });

  it("Should throw because is trying to remove a not allowed address", async () => {
    Database.network.findOne
      .mockReturnValueOnce(({
        allow_list: [],
        close_task_allow_list: []
      }));
    await expect(() => updateAllowListByType(address, networkId, AllowListTypes.OPEN_TASK, "remove"))
      .rejects
      .toThrow(new HttpBadRequestError(ErrorMessages.UserNotAllowed));
  });
});