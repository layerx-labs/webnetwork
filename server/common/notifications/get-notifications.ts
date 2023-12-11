import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import paginate, { calculateTotalPages } from "helpers/paginate";

import {BadRequestErrors} from "interfaces/enums/Errors";
import {UserRole} from "interfaces/enums/roles";

import {isAddress} from "../../../helpers/is-address";
import {lowerCaseCompare} from "../../../helpers/string";
import {HttpBadRequestError, HttpUnauthorizedError} from "../../errors/http-errors";

export async function getNotifications(req: NextApiRequest) {
  const {address, id} = req.query as {address: string, id: string};
  const {page = 1, read = null,} = req.query as {page: string, read?: string};
  const {context: {token: {roles}, user: {id: userId, address: userAddress}}} = req.body;

  const userIsAdmin = roles.includes(UserRole.ADMIN);

  console.log(`UserId`, userId);

  if (!userId)
    throw new HttpUnauthorizedError();

  console.log(`userAddress`, userAddress, address)

  if (!userIsAdmin && (
      (address && !lowerCaseCompare(address, userAddress))
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

    /** if address search, we need to include the user instead */
    ... address ? {} : {id: {[Op.eq]: +id}},

    /** if read is provided, it will look up read as true or false, otherwise "read" state is ignored */
    ... read !== null ? {read: {[Op.eq]: read.toLowerCase() === "true"}} : {},
  }

  const include = []
  if (address)
    include.push({ association: "user", attributes: ['address'] });

  /** if "address" is provided, we paginate the result, otherwise we return a simple "findAll" */
  if(address){
    const notifications = 
      await models.notification.findAndCountAll(paginate({ where, include }, { page: +page }, [["createdAt", "DESC"]]));

    return {
      ...notifications,
      currentPage: page,
      pages: calculateTotalPages(notifications?.count)
    };
  } 
  
  return models.notification.findAll(where)
}