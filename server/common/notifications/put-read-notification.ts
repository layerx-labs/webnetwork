import {NextApiRequest} from "next";

import {BadRequestErrors, NotFoundErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpNotFoundError, HttpUnauthorizedError} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function putReadNotification(req: NextApiRequest) {
  const {id, read} = req.query as {address: string, read: "true"|"false", id: string};
  const {context: {user:{id: userId}}} = req.body;

  if (!userId)
    throw new HttpUnauthorizedError();

  if (!id || id && isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotANumber);

  if (["true", "false"].every(s => s !== read))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const [notification] = await getNotifications({query: {id}, body: req.body} as any);

  if (!notification)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  return notification.update({read: read === "true"});
}