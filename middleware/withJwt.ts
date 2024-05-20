import {NextApiHandler} from "next";
import {getToken} from "next-auth/jwt";
import getConfig from "next/config";

import {MISSING_JWT_TOKEN} from "helpers/error-messages";

import {isMethodAllowed} from "server/utils/http";

const { serverRuntimeConfig } = getConfig();

export const withJWT = (handler: NextApiHandler, allowedMethods = ['GET']): NextApiHandler => {
  return async (req, res) => {
    const token = await getToken({ req, secret: serverRuntimeConfig?.auth?.secret });

    const bodyWithContext = {
      ...req.body,
      context: {
        ...req.body?.context,
        token
      }
    };

    req.body = bodyWithContext;

    if (!isMethodAllowed(req.method, allowedMethods) && !token)
      return res.status(401).json({ message: MISSING_JWT_TOKEN });

    return handler(req, res);
  };
};
