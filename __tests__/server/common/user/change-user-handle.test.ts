import {NextApiRequest} from "next";

import {changeUserHandle} from "server/common/user/change-user-handle";
import {getUserByAddress} from "server/common/user/get-user-by-address";
import {getUserByHandle} from "server/common/user/get-user-by-handle";
import {HttpBadRequestError, HttpConflictError, HttpForbiddenError} from "server/errors/http-errors";
import {UserRoleUtils} from "server/utils/jwt";

jest.mock('server/common/user/get-user-by-handle', () => ({getUserByHandle: jest.fn()}));
jest.mock('server/common/user/get-user-by-address', () => ({getUserByAddress: jest.fn()}));

jest.mock('server/utils/jwt', () => ({
  UserRoleUtils: {
    hasAdminRole: jest.fn(),
  },
}));

describe('changeUserHandle', () => {
  let mockRequest: Partial<NextApiRequest>;

  beforeEach(() => {
    mockRequest = {
      query: {},
      body: {
        context: {
          token: {roles: []},
          user: {id: 1}
        },
      },
    };
  });

  afterEach(() => {
    (getUserByHandle as jest.Mock).mockClear();
    (getUserByAddress as jest.Mock).mockClear();
  })

  it('should throw HttpBadRequestError if handle is missing', async () => {
    await expect(changeUserHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpBadRequestError if handle is invalid', async () => {
    mockRequest.query = {handle: 'invalid handle'};
    await expect(changeUserHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpConflictError if user with the new handle already exists', async () => {
    (getUserByHandle as jest.Mock).mockResolvedValue({id: 2});

    mockRequest.query = {handle: 'newHandle'};

    await expect(changeUserHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpConflictError);
  });

  it('should throw HttpForbiddenError if user does not have admin role and is not the same user being modified', async () => {
    (getUserByHandle as jest.Mock).mockResolvedValue(false);
    (getUserByAddress as jest.Mock).mockResolvedValue({id: 2});
    (UserRoleUtils.hasAdminRole as jest.Mock).mockReturnValue(false);

    mockRequest.query = {handle: 'newHandle'};

    await expect(changeUserHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpForbiddenError);
  });

  it('should update user handle if all conditions are met', async () => {
    const update = jest.fn();

    (getUserByHandle as jest.Mock).mockResolvedValue(null);
    (getUserByAddress as jest.Mock).mockResolvedValue({id: 1, update});
    (UserRoleUtils.hasAdminRole as jest.Mock).mockReturnValue(true);

    mockRequest.query = {handle: 'newHandle'};
    await changeUserHandle(mockRequest as NextApiRequest);

    expect(update).toHaveBeenCalled();
  });
});