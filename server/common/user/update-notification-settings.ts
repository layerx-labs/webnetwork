import { NextApiRequest } from "next";

import models from "db/models";

import { lowerCaseCompare } from "helpers/string";

import { HttpBadRequestError, HttpForbiddenError } from "server/errors/http-errors";

export async function updateNotificationSettings(req: NextApiRequest) {
  const { address } = req.query as { address: string };
  const { context: { user }, ...payload } = req.body;

  if (!address)
    throw new HttpBadRequestError("Missing address");

  if (!lowerCaseCompare(address, user.address))
    throw new HttpForbiddenError();

  const [settings] = await models.notificationSettings.findOrCreate({
    where: {
      userId: user.id
    },
    defaults: {
      userId: user.id
    }
  });

  const settingsKeys = Object.keys(payload);

  const invalidSettings = settingsKeys.filter(key => !(key in settings));
  if (invalidSettings.length)
    throw new HttpBadRequestError(`Invalid settings: ${invalidSettings.join(", ")}`);

  for (const key of settingsKeys) {
    settings[key] = payload[key];
  }

  await settings.save();
}