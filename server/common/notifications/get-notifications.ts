import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import paginate from "helpers/paginate";

import {BadRequestErrors} from "interfaces/enums/Errors";
import {UserRole} from "interfaces/enums/roles";

import {HttpBadRequestError, HttpUnauthorizedError} from "../../errors/http-errors";
import {isAddress} from "../../../helpers/is-address";

export function getNotifications(req: NextApiRequest) {
  const {address, id} = req.query as {address: string, id: string};
  const {page = 1, read = null,} = req.query as {page: string, read?: string};
  const {context: {token: {roles}, user: {id: userId, address: userAddress}}} = req.body;

  const userIsAdmin = roles.includes(UserRole.ADMIN);

  if (!userId)
    throw new HttpUnauthorizedError();

  if (!userIsAdmin && (
      (address && address !== userAddress)
      || (id && id !== userId)))
    throw new HttpUnauthorizedError();

  if (!id && !address)
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  if (address && !isAddress(address))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotAnAddress);

  if (id && isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParamsNotANumber);
  
  if (read && !["true", "false"].includes(read.toLowerCase()))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const where = {
    /** Because we already checked for address vs userAddress we don't need to, but we haven't made the
     * same for the userId so instead of returning unauthorized we add that to the statement and return results
     * only if the requesting user matches the notification.userId (or requesting user is Admin) */
    ... !roles.includes(UserRole.ADMIN) ? {userId: {[Op.eq]: userId}} : {},

    /** if address is provided, it means "all notifications" otherwise query for single notification.id */
    ... address ? {address: {[Op.iLike]: address}} : {id: {[Op.eq]: +id}},

    /** if read is provided, it will look up read as true or false, otherwise "read" state is ignored */
    ... read !== null ? {read: {[Op.eq]: read.toLowerCase() === "true"}} : {},
    include: [
      {association: "user"}
    ]
  }

  /** if "address" is provided, we paginate the result, otherwise we return a simple "findAll" */
  return models.notification.findAll(address ? paginate({where},{page: +page}) : where);
}