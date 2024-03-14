import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {HttpBadRequestError, HttpNotFoundError} from "server/errors/http-errors";

export async function getUserByAddress(req: NextApiRequest) {
  const {address} = req.query as {address: string};

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address))
    throw new HttpBadRequestError("invalid address or not provided");

  const user = await models.user.findOne({where: {address: {[Op.iLike]: address}}})

  if (!user)
    throw new HttpNotFoundError("user not found")

  return user;
}