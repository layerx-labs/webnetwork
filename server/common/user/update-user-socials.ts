import {NextApiRequest} from "next";

import {lowerCaseCompare} from "../../../helpers/string";
import {BadRequestErrors, ForbiddenErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpForbiddenError} from "../../errors/http-errors";
import {getUserByAddress} from "./get-user-by-address";

export async function updateUserSocials(req: NextApiRequest) {

  const {github, linkedin} = req.body;
  const repoSocialRegex = /https:\/\/(gitlab|github)\.com\/\w+/;
  const linkedInRegex = /https:\/\/linkedin\.com\/in\/\w+/;

  if (github === undefined && linkedin === undefined)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  if (github && !repoSocialRegex.test(github))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  if (linkedin && !linkedInRegex.test(linkedin))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const user = await getUserByAddress(req);

  if (!lowerCaseCompare(req.query?.address as string, req.body.context.user.address))
    throw new HttpForbiddenError(ForbiddenErrors.NotTheOwner);

  const update = {
    ... github !== undefined ? {githubLink: github} : {},
    ... linkedin !== undefined ? {linkedInLink: linkedin} : {},
  }

  await user.update(update);
  await user.save();

  return user.dataValues;
}