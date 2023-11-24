import {NextApiRequest} from "next";

import {BadRequestErrors, ForbiddenErrors, NotFoundErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpForbiddenError, HttpNotFoundError} from "../../errors/http-errors";
import {getNotifications} from "./get-notifications";

export async function putReadNotification(req: NextApiRequest) {
  const {id} = req.query as {address: string, id: string};
  const {context: {user:{id: userId}}, read} = req.body;

  if (!id || id && isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotANumber);

  const [notification] = await getNotifications({query: {id}} as any);

  if (!notification)
    throw new HttpNotFoundError(NotFoundErrors.NotificationNotFound);

  if (notification?.userId !== +userId)
    throw new HttpForbiddenError(ForbiddenErrors.NotTheOwner);

  if (![true, "true", false, "false"].includes(read))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  return notification.update({read: [true, "true"].includes(read)});
}