import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {HttpUnauthorizedError} from "server/errors/http-errors";

export async function markAllNotificationsRead(req: NextApiRequest) {
  const {context: {user:{id: userId}}} = req.body;

  if (!userId)
    throw new HttpUnauthorizedError();

  return models.notification.update({read: true}, {where: {userId: {[Op.eq]: userId}}});
}