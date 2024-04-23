import {NextApiRequest} from "next";

import {getUserByAddress} from "../../../../server/common/user/get-user-by-address";
import {updateUserSocials} from "../../../../server/common/user/update-user-socials";
import {HttpBadRequestError, HttpForbiddenError} from "../../../../server/errors/http-errors";

jest.mock('server/common/user/get-user-by-handle', () => ({getUserByHandle: jest.fn()}));
jest.mock('server/common/user/get-user-by-address', () => ({getUserByAddress: jest.fn()}));

jest.mock('server/utils/jwt', () => ({
  UserRoleUtils: {
    hasAdminRole: jest.fn(),
  },
}));

describe('updateUserSocials', () => {
  let mockRequest: NextApiRequest;

  beforeEach(() => {
    mockRequest = {
      query: {address: "0x0"},
      body: {
        context: {
          user: {
            address: "0x0"
          }
        }
      },
    } as unknown as NextApiRequest;
  })

  afterEach(() => {
    (getUserByAddress as jest.Mock).mockClear();
  })

  it("fails because no github or linkedin value", async () => {
    await expect(updateUserSocials(mockRequest)).rejects.toThrow(HttpBadRequestError)
  });

  it("fails because not a correct github value", async () => {
    mockRequest.body.github = "some_value";
    await expect(updateUserSocials(mockRequest)).rejects.toThrow(HttpBadRequestError)
  });

  it("fails because not a correct linkedin value", async () => {
    mockRequest.body.linkedin = "some_value";
    await expect(updateUserSocials(mockRequest)).rejects.toThrow(HttpBadRequestError)
  });

  it("fails because query address does not match context address", async () => {
    mockRequest.body.github = "https://github.com/some_user";
    mockRequest.body.context.user.address = "0x1";
    await expect(updateUserSocials(mockRequest)).rejects.toThrow(HttpForbiddenError)
  });

  it("succeeds to update github", async () => {
    const update = jest.fn();
    const save = jest.fn();

    (getUserByAddress as jest.Mock).mockResolvedValue({id: 1, update, save});

    mockRequest.body.github = "https://github.com/some_user";
    await updateUserSocials(mockRequest);

    expect(update).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
  });

  it("succeeds to update linkedin", async () => {
    const update = jest.fn();
    const save = jest.fn();

    (getUserByAddress as jest.Mock).mockResolvedValue({id: 1, update, save});

    mockRequest.body.linkedin = "https://linkedin.com/in/some_user";
    await updateUserSocials(mockRequest);

    expect(update).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
  });

})