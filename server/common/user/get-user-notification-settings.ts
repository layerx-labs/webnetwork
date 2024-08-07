import { NextApiRequest } from "next";

import models from "db/models";

import { lowerCaseCompare } from "helpers/string";

import { HttpBadRequestError, HttpForbiddenError } from "server/errors/http-errors";

export async function getUserNotificationSettings(req: NextApiRequest) {
  const { address } = req.query as { address: string };
  const { context: { user } } = req.body;

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

  return settings;
}