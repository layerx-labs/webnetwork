import { NextApiRequest } from "next";

import models from "db/models";

import { HttpNotFoundError } from "server/errors/http-errors";

export async function patch(req: NextApiRequest) {
  const { id } = req.body.context.user;

  const user = await models.user.findOne({
    where: {
      id,
    },
  });

  if (!user) throw new HttpNotFoundError("User not found");

  user.resetedAt = new Date();
  user.githubLogin = null;

  await user.save();

  return "User reseted successfully";
}