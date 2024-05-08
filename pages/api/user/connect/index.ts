import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import {Op} from "sequelize";

import models from "db/models";

import {caseInsensitiveEqual} from "helpers/db/conditionals";

import {withProtected} from "middleware";

import {HttpBadRequestError, HttpConflictError} from "server/errors/http-errors";

enum Actions {
  REGISTER = "register",
  CONNECT_GITHUB = "github"
}

async function patch(req: NextApiRequest) {
  let action;

  const token = await getToken({req});

  const handle = token.login.toString();
  const address = token.address.toString();

  const user = await models.user.findOne({
    where: {
      [Op.or]: [
        {
          address: caseInsensitiveEqual("address", address)
        },
        {
          handle: caseInsensitiveEqual("githubLogin", handle)
        }
      ]
    }
  });

  if (!user) action = Actions.REGISTER;
  else if (user.address && !user.handle) action = Actions.CONNECT_GITHUB;

  if (!action)
    throw new HttpConflictError("no actions needed for this user")

  if (action === Actions.REGISTER) {
    if (!address)
      throw new HttpBadRequestError("missing wallet address")

    await models.user.create({
      address,
      handle
    });
  } else if (action === Actions.CONNECT_GITHUB) {
    user.handle = handle;

    await user.save();
  }

  return {message: "success"};

}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "patch":
    await patch(req);
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withProtected(handler);
