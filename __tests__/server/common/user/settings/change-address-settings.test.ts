import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import {changeAddressSettings} from "server/common/user/settings/change-address-settings";
import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

jest.mock("db/models", () => ({
  userSetting: {
    findOrCreate: jest.fn().mockReturnValue([{userSetting: jest.fn()}, {created: jest.fn()} ])
  }
}));

jest.mock("date-fns", () => ({
  addYears: () => new Date("Sat, 14 Dec 2024 17:43:00 GMT")
}));

const mockSetHeader = jest.fn();
const mockedResponse = {
  setHeader: mockSetHeader
} as unknown as NextApiResponse;
describe("changeAddressSettings", () => {

  let mockedRequest: NextApiRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRequest = {
      body: {
        context: {token: {roles: []}, user: { id: 1}},
        settings: null,
      }} as NextApiRequest;
  });

  it("should throw an error when user does not exist", async () => {
    mockedRequest.body.context.user = null;
    await expect(() =>
      changeAddressSettings(mockedRequest, mockedResponse)).rejects.toBeInstanceOf(HttpUnauthorizedError);
  });

  it("should throw an error when settings does not exist", async () => {
    await expect(() =>
      changeAddressSettings(mockedRequest, mockedResponse)).rejects.toBeInstanceOf(HttpBadRequestError);
  });

  it("should throw an error when settings has disallowed properties", async () => {
    mockedRequest.body.settings = {forbidden: "property"};
    await expect(() =>
      changeAddressSettings(mockedRequest, mockedResponse)).rejects.toBeInstanceOf(HttpBadRequestError);
  });

  it("should throw an error when language setting is not valid", async () => {
    mockedRequest.body.settings = {language: "abc"};

    await expect(() =>
      changeAddressSettings(mockedRequest, mockedResponse)).rejects.toBeInstanceOf(HttpBadRequestError);
  });

  it("should throw an error when notifications setting is not a boolean", async () => {
    mockedRequest.body.settings = {notifications: "not-a-bool"};

    await expect(() =>
      changeAddressSettings(mockedRequest, mockedResponse)).rejects.toBeInstanceOf(HttpBadRequestError);
  });

  it("should not update because user settings doesn't exists", async () => {
    const saveMock = jest.fn();
    jest
      .spyOn(models.userSetting, "findOrCreate")
      .mockImplementationOnce(() => [{ save: saveMock }, true ]);

    mockedRequest.body.settings = {notifications: true, language: 'en'}

    await changeAddressSettings(mockedRequest, mockedResponse);
    expect(saveMock).not.toHaveBeenCalled();
    expect(mockSetHeader)
      .toHaveBeenCalledWith("Set-Cookie", `next-i18next-locale=en; expires=Sat, 14 Dec 2024 17:43:00 GMT; path=/`);
  });

  it("should update user settings when everything is valid", async () => {
    const saveMock = jest.fn();
    jest
      .spyOn(models.userSetting, "findOrCreate")
      .mockImplementationOnce(() => [{ save: saveMock }, false ]);

    mockedRequest.body.settings = {notifications: true, language: 'en'}

    await changeAddressSettings(mockedRequest, mockedResponse);
    expect(saveMock).toHaveBeenCalled();
    expect(mockSetHeader)
      .toHaveBeenCalledWith("Set-Cookie", `next-i18next-locale=en; expires=Sat, 14 Dec 2024 17:43:00 GMT; path=/`);
  });
});