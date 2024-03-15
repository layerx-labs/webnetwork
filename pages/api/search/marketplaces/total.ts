import {NextApiRequest, NextApiResponse} from "next";
import {Op, WhereOptions} from "sequelize";

import models from "db/models";

import {withCORS} from "middleware";

async function get(req: NextApiRequest) {
  const whereCondition: WhereOptions = {};

  const {creatorAddress, name, isClosed, isRegistered} = req.query || {};

  if (creatorAddress)
    whereCondition.creatorAddress = {[Op.iLike]: String(creatorAddress)};

  if (isClosed)
    whereCondition.isClosed = isClosed;

  if (isRegistered)
    whereCondition.isRegistered = isRegistered;

  if (name)
    whereCondition.name = name;

  return models.network.count({
    where: whereCondition
  });
}

async function GetAll(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(GetAll);
