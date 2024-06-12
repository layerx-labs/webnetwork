import {NextApiRequest, NextApiResponse} from "next";
import {Op, Sequelize} from "sequelize";

import models from "../../../db/models";
import {LogAccess} from "../../../middleware/log-access";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const users = await models.user.findAll({
    attributes: [
      [Sequelize.literal('CAST(ROW_NUMBER() OVER (ORDER BY "totalPoints" DESC) AS INTEGER)'), "position"],
      "address",
      "handle",
      "avatar",
      "totalPoints"
    ],
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { address: '0xfcf7372c0a1ad79e92d308b3f0a5499dabe3e7e4' },
            { address: { [Op.ne]: '0xfcf7372c0a1ad79e92d308b3f0a5499dabe3e7e4' } }
          ]
        }
      ]
    },
    order: [
      [Sequelize.literal('CASE WHEN "address" = \'0xfcf7372c0a1ad79e92d308b3f0a5499dabe3e7e4\' THEN 0 ELSE 1 END')],
      ["totalPoints", "DESC"]
    ],
    limit: 6
  });


  res.status(200).json({users})
  res.end();
}

export default LogAccess(handler)