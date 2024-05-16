import {Op} from "sequelize";

import models from "../../../db/models";
import {getUserByAddress} from "./get-user-by-address";


export async function getUserPointsHistory(req) {

  const user = await getUserByAddress(req);

  return models.pointsEvents.findAll({where: {userId: {[Op.eq]: user.id}}, raw: true});
}