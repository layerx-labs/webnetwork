import {NextApiRequest} from "next";
import getConfig from "next/config";

import {handleValidator} from "helpers/validators/handle-validator";

import { Logger } from "services/logging";

import {getUserByAddress} from "server/common/user/get-user-by-address";
import {getUserByHandle} from "server/common/user/get-user-by-handle";
import {HttpBadRequestError, HttpConflictError, HttpForbiddenError} from "server/errors/http-errors";
import { EventsService } from "server/services/events";
import {UserRoleUtils} from "server/utils/jwt";

const { publicRuntimeConfig } = getConfig();

export async function changeUserHandle(req: NextApiRequest) {
  const {handle} = req.query as {handle: string};

  if (!handle)
    throw new HttpBadRequestError("");

  if (!handleValidator(handle))
    throw new HttpBadRequestError("");

  if (await getUserByHandle({query: {handle}} as any))
    throw new HttpConflictError("");

  const user = await getUserByAddress(req);

  const {context:{token: {roles}, user: {id}}} = req.body;

  if (!UserRoleUtils.hasAdminRole(roles) && +id !== +user.id)
    throw new HttpForbiddenError("");

  await user.update({handle: handle.toLowerCase()});

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


  return user.dataValues;
}