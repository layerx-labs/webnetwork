import {NextApiRequest} from "next";

import models from "../../../db/models";
import {lowerCaseCompare} from "../../../helpers/string";
import {BadRequestErrors, ForbiddenErrors} from "../../../interfaces/enums/Errors";
import {Logger} from "../../../services/logging";
import {HttpBadRequestError, HttpForbiddenError} from "../../errors/http-errors";
import {addPointEntry} from "../../utils/points-system/add-point-entry";
import {removePointEntry} from "../../utils/points-system/remove-point-entry";
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

  const removePoints = async (actionName: string) => {
    const pointEvent = await models.pointsEvents.findOne({
      where: {
        userId: user.id,
        actionName: "add_github"
      }
    });

    if (pointEvent)
      await removePointEntry(pointEvent.id)
        .catch(e => Logger.info(e?.message))
  }

  if (update.githubLink)
    await addPointEntry(user.id, "add_github", { value: update.githubLink }).catch(e => Logger.info(e?.message));
  else
    await removePoints("add_github");


  if (update.linkedInLink)
    await addPointEntry(user.id, "add_linkedin", { value: update.linkedInLink }).catch(e => Logger.info(e?.message));
  else
    await removePoints("add_linkedin");


  await user.update(update);
  await user.save();

  return user.dataValues;
}