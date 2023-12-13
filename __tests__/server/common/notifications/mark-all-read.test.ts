import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {markAllNotificationsRead} from "server/common/notifications/mark-all-read";
import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

import {UserRole} from "../../../../interfaces/enums/roles";

jest.mock('db/models', () => ({
  notification: {
    update: jest.fn(),
  },
  sequelize: {
    literal: jest.fn(),
  }
}));

describe('markNotificationRead', () => {
  let mockRequest: Partial<NextApiRequest>;

  beforeEach(() => {
    mockRequest = {
      query:{address: "0xf15CC0ccBdDA041e2508B829541917823222F364"},
      body: {context: {user: {id: 1, address: "0xf15CC0ccBdDA041e2508B829541917823222F364"}}}}});

  it('should throw HttpUnauthorizedError if userId is missing', async () => {
    mockRequest.body.context.user.id = undefined;

    await expect(markAllNotificationsRead(mockRequest as NextApiRequest)).rejects.toThrow(HttpUnauthorizedError);
  });

  it('should throw HttpBadRequestError because not an address on query', async () => {
    mockRequest.query.address = "0xf"

    await expect(markAllNotificationsRead(mockRequest as NextApiRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it('should throw HttpUnauthorizedError because not admin trying for another address', async () => {
    mockRequest.body.context.token = {roles: [UserRole.USER]};
    mockRequest.query.address = "0xF33323fCe7d8878698781F33680fd24C7FEfbBba";
    await expect(markAllNotificationsRead(mockRequest as NextApiRequest)).rejects.toThrow(HttpUnauthorizedError);
  });

  it('should update notifications as read for the given userId', async () => {

    const mockUpdate = jest.spyOn(models.notification, 'update');
    mockUpdate.mockResolvedValue([1]);

    await markAllNotificationsRead(mockRequest as NextApiRequest);
    const expectedAddress = (mockRequest.query.address as string).toLowerCase();
    const where = {
      where: {
        userId: {
          [Op.in]:
            models.sequelize
              .literal(`(SELECT "id" FROM "users" WHERE lower("address") = '${expectedAddress}')`)}}};

    expect(mockUpdate).toHaveBeenCalledWith({ read: true }, where);
  });
});