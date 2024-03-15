import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {handleValidator} from "helpers/validators/handle-validator";

import {HttpBadRequestError} from "server/errors/http-errors";

export async function getUserByHandle(req: Pick<NextApiRequest, "query">) {
  const {handle} = req.query as {handle: string};

  if (!handle || !handleValidator(handle))
    throw new HttpBadRequestError("invalid handle");

  return models.user.findOne({where: {handle: {[Op.iLike]: handle.toLowerCase()}}})
}