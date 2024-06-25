import { NextApiRequest } from "next";
import getConfig from "next/config";

import { BadRequestErrors } from "interfaces/enums/Errors";

import { Logger } from "services/logging";

import { HttpBadRequestError } from "server/errors/http-errors";
import { EventsService } from "server/services/events";

const { publicRuntimeConfig } = getConfig();

export async function updateUserFullName(req: NextApiRequest) {
  const { fullName, context: { user } } = req.body;

  if (fullName === undefined)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  if (fullName && fullName.length > 125)
    throw new HttpBadRequestError(BadRequestErrors.WrongLength)

  await user.update({ fullName });
  await user.save();

  const eventsUrl = publicRuntimeConfig?.urls?.events;

  if (eventsUrl) {
    EventsService.sendUpdateUserProfileImage({
      url: eventsUrl,
      id: user.id
    })
      .catch(error => {
        Logger.error(error, `Failed to update user image`);
      });
  }
}