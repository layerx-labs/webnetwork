import {NextApiRequest} from "next";

import models from "db/models";

import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

export function changeAddressSettings(req: NextApiRequest) {
  const {context: {user}, settings} = req.body;

  if (!user?.id)
    throw new HttpUnauthorizedError();

  if (!settings)
    throw new HttpBadRequestError();

  const allowSettingsProps = [
    "notifications", "language",
  ];

  if (!Object.keys(settings).every(k => allowSettingsProps.includes(k)))
    throw new HttpBadRequestError();

  if (settings.language && !/^([a-z]{2}|[A-Z]{2})$/.test(settings.language))
    throw new HttpBadRequestError();

  if (settings.notifications && ![true,false].includes(settings.notifications))
    throw new HttpBadRequestError()

  return models.userSetting.update(settings, {where: {userId: user.id}})
}