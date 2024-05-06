import {NextApiRequest} from "next";

import {lowerCaseCompare} from "../../../helpers/string";
import {BadRequestErrors, ForbiddenErrors} from "../../../interfaces/enums/Errors";
import {Logger} from "../../../services/logging";
import {HttpBadRequestError, HttpForbiddenError} from "../../errors/http-errors";
import {addPointEntry} from "../../utils/add-point-entry";
import {getUserByAddress} from "./get-user-by-address";

export async function updateUserSocials(req: NextApiRequest) {

  const {github, linkedin} = req.body;
  const repoSocialRegex = /^https:\/\/(gitlab|github)\.com\/[a-zA-Z0-9_]*$/;
  const linkedInRegex = /^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9_]*$/;

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
    ...github !== undefined ? {githubLink: github} : {},
    ...linkedin !== undefined ? {linkedInLink: linkedin} : {},
  }

  if (update.githubLink)
    await addPointEntry(user.id, "add_github", { value: update.githubLink }).catch(e => Logger.info(e?.message));

  if (update.linkedInLink)
    await addPointEntry(user.id, "add_linkedin", { value: update.linkedInLink }).catch(e => Logger.info(e?.message));

  await user.update(update);
  await user.save();

  return user.dataValues;
}