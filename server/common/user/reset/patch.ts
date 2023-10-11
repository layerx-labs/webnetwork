import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";

import { HttpNotFoundError } from "server/errors/http-errors";

export async function patch(req: NextApiRequest) {
  const token = await getToken({ req });

  console.log('token', token)

  const githubLogin = token.login.toString();
  const address = token.address.toString();

  const user = await models.user.findOne({
    where: {
    address: caseInsensitiveEqual("address", address),
    githubLogin: caseInsensitiveEqual("githubLogin", githubLogin)
    }
  });

  if (!user) 
    throw new HttpNotFoundError("User not found");

  user.resetedAt = new Date();
  user.githubLogin = null;

  await user.save();

  return "User reseted successfully";
}