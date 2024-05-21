import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "../../../db/models";
import {lowerCaseCompare} from "../../../helpers/string";
import {BadRequestErrors, ForbiddenErrors} from "../../../interfaces/enums/Errors";
import {Logger} from "../../../services/logging";
import {HttpBadRequestError, HttpForbiddenError} from "../../errors/http-errors";
import {addPointEntry} from "../../utils/points-system/add-point-entry";
import {removePointEntry} from "../../utils/points-system/remove-point-entry";
import {getUserByAddress} from "./get-user-by-address";

export async function updateUserSocials(req: NextApiRequest) {

  const {github, linkedin, twitter} = req.body;
  const repoSocialRegex = /^https:\/\/(gitlab|github)\.com\/[a-zA-Z0-9_]*$/;
  const linkedInRegex = /^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9_]*$/;
  const xComRegex = /^https:\/\/(twitter|x)\.com\/[a-zA-Z0-9_]*$/;

  if (github === undefined && linkedin === undefined && twitter === undefined)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  const regexTest = [[github, repoSocialRegex], [linkedin, linkedInRegex], [twitter, xComRegex],]
  for (const [value, regex] of regexTest)
    if (value && !regex.test(value))
      throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const user = await getUserByAddress(req);

  if (!lowerCaseCompare(req.query?.address as string, req.body.context.user.address))
    throw new HttpForbiddenError(ForbiddenErrors.NotTheOwner);

  const update = {
    ...github !== undefined ? {githubLink: github} : {},
    ...linkedin !== undefined ? {linkedInLink: linkedin} : {},
    ...twitter !== undefined ? {twitterLink: twitter} : {},
  }

  const removePoints = async (actionName: string) => {
    const pointEvent = await models.pointsEvents.findOne({
      where: {
        userId: user.id,
        actionName: {[Op.eq]: actionName}
      }
    });

    if (pointEvent)
      await removePointEntry(pointEvent.id)
        .catch(e => Logger.info(e?.message))
  }

  const socials = [
    [update.githubLink, "add_github"],
    [update.linkedInLink, "add_linkedin"],
    [update.twitterLink, "add_twitter"],
  ];

  console.log(`UPDATING`, update);

  for (const [value, action] of socials) {
    if (value)
      await addPointEntry(user.id, action, {value}).catch(e => Logger.info(e?.message));
    else await removePoints(action)
  }

  await user.update(update);
  await user.save();

  return user.dataValues;
}