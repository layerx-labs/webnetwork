import {NextApiRequest} from "next";

import models from "../../../db/models";
import {BadRequestErrors} from "../../../interfaces/enums/Errors";
import {Logger} from "../../../services/logging";
import {HttpBadRequestError} from "../../errors/http-errors";
import {addPointEntry} from "../../utils/points-system/add-point-entry";
import {removePointEntry} from "../../utils/points-system/remove-point-entry";

export async function updateUserAbout(req: NextApiRequest) {
  const {about, context: {user}} = req.body;
  
  if (about === undefined)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  if (about && about.length > 512)
    throw new HttpBadRequestError(BadRequestErrors.WrongLength)



  if (about)
    await addPointEntry(user.id, "add_about", { value: about }).catch(e => Logger.info(e?.message));
  else {
    const pointEvent = await models.pointsEvents.findOne({
      where: {
        userId: user.id,
        actionName: "add_about"
      }
    });

    if (pointEvent)
      await removePointEntry(pointEvent.id);
  }

  await user.update({about})
  await user.save();

  return user.dataValues;
}