import { NextApiRequest } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import { lowerCaseCompare } from "helpers/string";

export async function getPointsLeaderboard(req: NextApiRequest) {
  const address = req.query?.address?.toString();

  const users = await models.user.findAll({
    attributes: [
      [Sequelize.literal('ROW_NUMBER() OVER (ORDER BY "totalPoints" DESC)'), "position"],
      "address",
      "handle",
      "avatar",
      "totalPoints"
    ],
    order: [["totalPoints", "DESC"]],
  });

  const user = address ? users.find(u => lowerCaseCompare(u.address, address)) : null;

  return {
    top: users.slice(0, 5),
    user
  };
}