import {NextApiRequest} from "next";

import models from "db/models";

import {HttpUnauthorizedError} from "server/errors/http-errors";

export function getAddressSettings(req: NextApiRequest) {
  const {context: {user}} = req.body;

  if (!user?.id)
    throw new HttpUnauthorizedError();

  return models.userSetting.findOne({where: {userId: user.id}});
}