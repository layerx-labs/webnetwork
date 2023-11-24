import {NextApiRequest} from "next";

import {BadRequestErrors, ForbiddenErrors, NotFoundErrors} from "../../../interfaces/enums/Errors";
import {UserRole} from "../../../interfaces/enums/roles";
import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFoundError,
  HttpUnauthorizedError
} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function putReadNotification(req: NextApiRequest) {
  const {id} = req.query as {address: string, id: string};
  const {context: {user:{id: userId}, tokens: {roles}}, read} = req.body;

  if (!userId)
    throw new HttpUnauthorizedError();

  if (!id || id && isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotANumber);

  if (![true, "true", false, "false"].includes(read))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const [notification] = await getNotifications({query: {id}} as any);

  if (!notification)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  if (!roles.includes(UserRole.ADMIN) && notification?.userId !== +userId)
    throw new HttpForbiddenError(ForbiddenErrors.NotTheOwner);

  return notification.update({read: [true, "true"].includes(read)});
}