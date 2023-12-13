import {NextApiRequest} from "next";
import {validate as isUUID} from 'uuid'

import models from "db/models";

import {BadRequestErrors, NotFoundErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpNotFoundError, HttpUnauthorizedError} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function markNotificationRead(req: NextApiRequest) {
  const {id, read} = req.query as {address?: string, read: "true"|"false", id?: string};
  const {context: {user:{id: userId}}} = req.body;

  let currentId;

  if (!userId)
    throw new HttpUnauthorizedError();

  if (!id)
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  if (["true", "false"].every(s => s !== read))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  if(isUUID(id)){
    const notif = await models.notification.findOne({
      where: {
        uuid: id,
        userId
      }
    })

    currentId = +notif?.id
  } else currentId = +id 

  if(isNaN(currentId))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotANumber);

  const [notifications] = await getNotifications({query: {id: +currentId}, body: req.body} as any);

  if (!notifications)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  return notifications.update({read: read === "true"});
}