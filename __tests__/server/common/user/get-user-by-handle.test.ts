import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {getUserByHandle} from "server/common/user/get-user-by-handle";
import {HttpBadRequestError} from "server/errors/http-errors";

jest.mock('helpers/validators/handle-validator', () => ({
  handleValidator: jest.fn(),
}));

jest.mock('db/models', () => ({
  user: {
    findOne: jest.fn(),
  },
}));

describe('getUserByHandle', () => {
  let mockRequest: Partial<NextApiRequest>;
  const mockHandleValidator = jest.requireMock('helpers/validators/handle-validator');
  beforeEach(() => {
    mockRequest = {
      query: {},
    };
  });

  afterEach(() => {
    mockHandleValidator.handleValidator.mockClear();
    models.user.findOne.mockClear();
  })

  it('should throw HttpBadRequestError if handle is missing', async () => {
    await expect(getUserByHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpBadRequestError if handle is invalid', async () => {
    mockHandleValidator.handleValidator.mockReturnValue(false);

    mockRequest.query = { handle: 'invalidHandle' };

    await expect(getUserByHandle(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);

    expect(mockHandleValidator.handleValidator).toHaveBeenCalledWith('invalidHandle');
  });

  it('should throw HttpNotFoundError if user is not found', async () => {
    mockHandleValidator.handleValidator.mockReturnValue(true);

    models.user.findOne.mockResolvedValue(null);

    mockRequest.query = { handle: 'validHandle' };

    await expect(getUserByHandle(mockRequest as NextApiRequest)).resolves.toBeNull();

    expect(models.user.findOne).toHaveBeenCalledWith({
      where: { handle: { [Op.iLike]: 'validhandle' } },
    });
  });

  it('should return the user if found', async () => {
    mockHandleValidator.handleValidator.mockReturnValue(true);

    const mockUser = { id: 1, username: 'testUser', handle: 'validhandle' };
    models.user.findOne.mockResolvedValue(mockUser);

    mockRequest.query = { handle: 'validHandle' };

    const result = await getUserByHandle(mockRequest as NextApiRequest);

    expect(models.user.findOne).toHaveBeenCalledWith({
      where: { handle: { [Op.iLike]: 'validhandle' } },
    });

    expect(result).toEqual(mockUser);
  });
});