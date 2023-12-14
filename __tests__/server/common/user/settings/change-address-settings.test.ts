import {NextApiRequest} from "next";

import models from "db/models";

import {changeAddressSettings} from "server/common/user/settings/change-address-settings";
import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

jest.mock("db/models", () => ({
  userSetting: {
    findOrCreate: jest.fn().mockReturnValue([{userSetting: jest.fn()}, {created: jest.fn()} ])
  }
}));

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
    try {
      await changeAddressSettings(mockedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnauthorizedError);
    }
  });

  it("should throw an error when settings does not exist", async () => {
    try {
      await changeAddressSettings(mockedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });

  it("should throw an error when settings has disallowed properties", async () => {
    mockedRequest.body.settings = {forbidden: "property"};
    try {
      await changeAddressSettings(mockedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });

  it("should throw an error when language setting is not valid", async () => {
    mockedRequest.body.settings = {language: "abc"};
    try {
      await changeAddressSettings(mockedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });

  it("should throw an error when notifications setting is not a boolean", async () => {
    mockedRequest.body.settings = {notifications: "not-a-bool"};
    try {
      await changeAddressSettings(mockedRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });

  it("should update user settings when everything is valid", async () => {
    const mockUpdate = jest.fn();
    models.userSetting.update = mockUpdate;

    mockedRequest.body.settings = {notifications: true, language: 'en'}

    expect(await changeAddressSettings(mockedRequest)).toEqual("updated Settings");
  });
});