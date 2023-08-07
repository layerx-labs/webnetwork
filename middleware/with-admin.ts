import { NextApiHandler } from "next";
import getConfig from "next/config";

import { NOT_ADMIN_WALLET } from "helpers/constants";
import { toLower } from "helpers/string";

import { siweMessageService } from "services/ethereum/siwe";
import { Logger } from "services/logging";

import { isMethodAllowed } from "server/utils/http";

const { publicRuntimeConfig } = getConfig();

Logger.changeActionName(`withAdmin()`);

export const withAdmin = (handler: NextApiHandler, allowedMethods = ["GET"]): NextApiHandler => {
  return async (req, res) => {
    if (isMethodAllowed(req.method, allowedMethods))
      return handler(req, res);

    const adminWallet = toLower(publicRuntimeConfig?.adminWallet);
    const token = req.body?.context?.token;
    const message = req.body?.context?.typedMessage;
    const { signature, address } = token;

    if (!address || toLower(address) !== adminWallet)
      return res.status(401).json({ message: NOT_ADMIN_WALLET });

    if (!(await siweMessageService.decodeMessage(message, signature?.toString(), adminWallet)))
      return res.status(401).json({ message: NOT_ADMIN_WALLET });

    return handler(req, res);
  }
}