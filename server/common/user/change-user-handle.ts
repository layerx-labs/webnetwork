import {NextApiRequest} from "next";

import {handleValidator} from "helpers/validators/handle-validator";

import {HttpBadRequestError, HttpConflictError, HttpForbiddenError} from "server/errors/http-errors";
import {UserRoleUtils} from "server/utils/jwt";

import {getUserByAddress} from "./get-user-by-address";
import {getUserByHandle} from "./get-user-by-handle";


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

  return user.update({handle: handle.toLowerCase()})
}