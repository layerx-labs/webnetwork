import {NextApiRequest, NextApiResponse} from "next";
import {Op} from "sequelize";

import models from "../../../db/models";
import {LogAccess} from "../../../middleware/log-access";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  // throw new HttpBadRequestError("tested")

  const include = [{
    association: "user",
    include: [{
      association: "settings"
    }]
  }]


  res.status(200).json((await models.issue.findOne({where: {id: {[Op.eq]: 7}}, include})))
  res.end();
}

export default LogAccess(handler)