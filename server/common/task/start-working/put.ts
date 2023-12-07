import { NextApiRequest } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { HttpConflictError, HttpNotFoundError } from "server/errors/http-errors";

export default async function put(req: NextApiRequest) {
  const { id, context } = req.body;

  const issue = await models.issue.findOne({
    where: {
      id: {
        [Op.eq]: id
      }
    }
  });

  if (!issue)
    throw new HttpNotFoundError("Bounty not found");

  const user = context.user;

  const userIsAlreadyWorking = issue.working.find(el => +el === user.id);
  if (userIsAlreadyWorking)
    throw new HttpConflictError("User is already working");

  const newWorking = [...issue.working, user.id];

  issue.working = newWorking;

  await issue.save();

  return newWorking;
}