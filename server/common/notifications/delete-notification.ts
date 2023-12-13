import {NextApiRequest} from "next";

import {NotFoundErrors} from "../../../interfaces/enums/Errors";
import {HttpNotFoundError, HttpUnauthorizedError} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function deleteNotification(req: NextApiRequest) {
  const {id} = req.query;
  const {context: {user: {id: userId}}} = req.body;

  if (!userId)
    throw new HttpUnauthorizedError();

  const [notification] = await getNotifications({query: {id}, body: req.body} as any)

  if (!notification)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  return notification.update({hide: true});
}