import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {isAddress} from "helpers/is-address";
import {lowerCaseCompare} from "helpers/string";

import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";
import {UserRoleUtils} from "server/utils/jwt";


export async function markAllNotificationsRead(req: NextApiRequest) {
  const {address} = req.query as {address: string};
  const {context: {user:{id: userId, address: userAddress}, token}} = req.body;

  if (!userId)
    throw new HttpUnauthorizedError();

  if (!isAddress(address))
    throw new HttpBadRequestError();

  if (!UserRoleUtils.hasAdminRole(token) && !lowerCaseCompare(userAddress, address))
    throw new HttpUnauthorizedError();

  const where = {
    where: {
      userId: {
        [Op.in]: // sequelize can't seem to use include in update :/
          models.sequelize.literal(`(SELECT "id" FROM "users" WHERE lower("address") = '${address.toLowerCase()}')`)
      }
    }
  }

  return models.notifications.update({read: true}, where);
}