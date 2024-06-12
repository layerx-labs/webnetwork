import { NextApiRequest } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

export async function getPointsLeaderboard(req: NextApiRequest) {
  const address = req.query?.address?.toString();

  const rowNumber = 'CAST(ROW_NUMBER() OVER (ORDER BY "totalPoints" DESC) AS INTEGER)';

  const users = await models.user.findAll({
    attributes: [
      [Sequelize.literal(rowNumber), "position"],
      "address",
      "handle",
      "avatar",
      "totalPoints"
    ],
    order: [
      [Sequelize.literal(`CASE WHEN "address" = '${address}' THEN 0 ELSE ${rowNumber} END`)],
      ["totalPoints", "DESC"]
    ],
    limit: 6,
  });

  let user = null

  if (address)
    user = users.shift();
  else
    users.pop();

  return {
    top: users,
    user
  };
}