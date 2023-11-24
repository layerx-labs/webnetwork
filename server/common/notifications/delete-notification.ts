import {NextApiRequest} from "next";

import {ForbiddenErrors, NotFoundErrors} from "../../../interfaces/enums/Errors";
import {UserRole} from "../../../interfaces/enums/roles";
import {HttpForbiddenError, HttpNotFoundError, HttpUnauthorizedError} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function deleteNotification(req: NextApiRequest) {
  const {id} = req.query;
  const {context: {token: {roles}, user: {id: userId}}} = req.body;

  if (!userId || !roles.includes(UserRole.ADMIN))
    throw new HttpUnauthorizedError();

  const [notification] = await getNotifications({query: {id}} as any)

  if (!notification)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  if (notification.userId !== +userId)
    throw new HttpForbiddenError(ForbiddenErrors.NotTheOwner);

  return notification.update({hide: true});
}