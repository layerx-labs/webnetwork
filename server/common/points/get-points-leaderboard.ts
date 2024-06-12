import { NextApiRequest } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import { lowerCaseCompare } from "helpers/string";

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
      [Sequelize.literal(`CASE WHEN LOWER("address") = LOWER('${address}') 
        AND ${rowNumber} > 5 THEN 0 ELSE ${rowNumber} END`)],
      ["totalPoints", "DESC"]
    ],
    limit: 6,
    raw: true
  });

  let user = null

  if (address) {
    if (lowerCaseCompare(users.at(0).address, address) && users.at(0).position > 5)
      user = users.shift();
    else {
      user = users.find(u => lowerCaseCompare(u.address, address));
      users.pop();
    }
  } else
    users.pop();

  return {
    top: users,
    user
  };
}