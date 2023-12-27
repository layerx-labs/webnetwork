import { addYears } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import {HttpBadRequestError, HttpUnauthorizedError} from "server/errors/http-errors";

export async function changeAddressSettings(req: NextApiRequest, res: NextApiResponse) {
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

  if (settings.language && !/^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(settings.language))
    throw new HttpBadRequestError();

  if (settings.notifications && ![true,false].includes(settings.notifications))
    throw new HttpBadRequestError()

  const [userSetting, created] = await models.userSetting.findOrCreate({
    where: { userId: user.id },
    defaults: settings
  });

  if (!created) {
    if(settings.language) userSetting.language = settings.language
    userSetting.notifications = settings.notifications
    await userSetting.save()
  }

  const expiresAt = addYears(new Date(), 1).toUTCString();

  res.setHeader("Set-Cookie", `next-i18next-locale=${settings.language}; expires=${expiresAt}; path=/`);

  return "updated Settings";
}