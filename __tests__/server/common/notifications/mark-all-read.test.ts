import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {markAllNotificationsRead} from "server/common/notifications/mark-all-read";
import {HttpUnauthorizedError} from "server/errors/http-errors";

jest.mock('db/models', () => ({
  notification: {
    update: jest.fn(),
  },
}));

describe('markNotificationRead', () => {
  let mockRequest: Partial<NextApiRequest>;

  beforeEach(() => {
    mockRequest = {body: {context: {user: {id: 1,}}}}});

  it('should throw HttpUnauthorizedError if userId is missing', async () => {
    mockRequest.body.context.user.id = undefined;

    await expect(markAllNotificationsRead(mockRequest as NextApiRequest)).rejects.toThrow(HttpUnauthorizedError);
  });

  it('should update notifications as read for the given userId', async () => {
    const mockUserId = 1;

    const mockUpdate = jest.spyOn(models.notification, 'update');
    mockUpdate.mockResolvedValue([1]);

    await markAllNotificationsRead(mockRequest as NextApiRequest);

    expect(mockUpdate).toHaveBeenCalledWith({ read: true },
      { where: { userId: { [Op.eq]: mockUserId } } });
  });
});