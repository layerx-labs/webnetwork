import {NextApiRequest} from "next";

import models from "db/models";

import {getAddressSettings} from "server/common/user/settings/get-address-settings";

import {HttpUnauthorizedError} from "../../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  userSetting: jest.fn()
}));

describe("getAddressSettings", () => {

  let mockedRequest: NextApiRequest;
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRequest = {
      body: {
        context: {token: {roles: []}, user: { id: 1}},
        settings: null,
      }} as NextApiRequest;
  });

  it("should throw HttpUnauthorizedError when user does not exist", () => {
    mockedRequest.body.context.user.id = ""
    expect(() => getAddressSettings(mockedRequest)).toThrow(HttpUnauthorizedError);
  });

  it("should fetch user settings when user exists", () => {
    const mockFindOne = jest.fn();
    models.userSetting.findOne = mockFindOne;

    getAddressSettings(mockedRequest);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { userId: 1 } });
  });
});