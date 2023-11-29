import {NextApiRequest} from "next";

import models from "db/models";

import {changeAddressSettings} from "server/common/user/settings/change-address-settings";
import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

jest.mock("db/models", () => ({
  userSetting: jest.fn()
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

  it("should throw an error when user does not exist", () => {
    mockedRequest.body.context.user = null;
    expect(() => changeAddressSettings(mockedRequest)).toThrow(HttpUnauthorizedError);
  });

  it("should throw an error when settings does not exist", () => {
    expect(() => changeAddressSettings(mockedRequest)).toThrow(HttpBadRequestError);
  });

  it("should throw an error when settings has disallowed properties", () => {
    mockedRequest.body.settings = {forbidden: "property"};
    expect(() => changeAddressSettings(mockedRequest)).toThrow(HttpBadRequestError);
  });

  it("should throw an error when language setting is not valid", () => {
    mockedRequest.body.settings = {language: "abc"};

    expect(() => changeAddressSettings(mockedRequest)).toThrow(HttpBadRequestError);
  });

  it("should throw an error when notifications setting is not a boolean", () => {
    mockedRequest.body.settings = {notifications: "not-a-bool"};

    expect(() => changeAddressSettings(mockedRequest)).toThrow(HttpBadRequestError);
  });

  it("should update user settings when everything is valid", () => {
    const mockUpdate = jest.fn();
    models.userSetting.update = mockUpdate;

    mockedRequest.body.settings = {notifications: true, language: 'en'}

    changeAddressSettings(mockedRequest);
    expect(mockUpdate).toHaveBeenCalledWith({notifications: true, language: 'en'}, {where: {userId: 1}});
  });
});