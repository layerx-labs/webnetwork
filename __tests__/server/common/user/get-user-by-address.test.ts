import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {getUserByAddress} from "server/common/user/get-user-by-address";
import {HttpBadRequestError, HttpNotFoundError} from "server/errors/http-errors";

const validAddress = "0x1a2b3c4d5e6f7A8B9C0D1E2F3A4B5C6D7E8F9A0B";

jest.mock('db/models', () => ({
  user: {
    findOne: jest.fn(),
  },
}));

describe('getUserByAddress', () => {
  let mockRequest: Partial<NextApiRequest>;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
  });

  it('should throw HttpBadRequestError if address is missing', async () => {
    await expect(getUserByAddress(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpBadRequestError if address is invalid', async () => {
    mockRequest.query = { address: 'invalidAddress' };
    await expect(getUserByAddress(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpNotFoundError if user is not found', async () => {
    models.user.findOne.mockResolvedValue(null);

    mockRequest.query = { address: validAddress };

    await expect(getUserByAddress(mockRequest as NextApiRequest)).rejects.toThrow(HttpNotFoundError);

    expect(models.user.findOne).toHaveBeenCalledWith({
      where: { address: { [Op.iLike]: validAddress } },
    });
  });

  it('should return the user if found', async () => {
    const mockUser = { id: 1, username: 'testUser', address: 'validAddress' };
    models.user.findOne.mockResolvedValue(mockUser);

    mockRequest.query = { address: validAddress };

    const result = await getUserByAddress(mockRequest as NextApiRequest);

    expect(models.user.findOne).toHaveBeenCalledWith({
      where: { address: { [Op.iLike]: validAddress } },
    });

    expect(result).toEqual(mockUser);
  });
});