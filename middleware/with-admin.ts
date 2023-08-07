import { NextApiHandler } from "next";
import getConfig from "next/config";

import {
  MISSING_ADMIN_SIGNATURE,
  NOT_ADMIN_WALLET,
  NOT_AN_ADMIN
} from "helpers/constants";
import { toLower } from "helpers/string";

import { siweMessageService } from "services/ethereum/siwe";
import { Logger } from "services/logging";

import { isMethodAllowed } from "server/utils/http";

const { publicRuntimeConfig } = getConfig();

Logger.changeActionName(`withAdmin()`);

export const withAdmin = (handler: NextApiHandler, allowedMethods = ["GET"]) => {
  return async (req, res) => {
    console.log("withAdmin", req)

    if (isMethodAllowed(req.method, allowedMethods))
      return handler(req, res);

    const adminWallet = toLower(publicRuntimeConfig?.adminWallet);
    const token = req.body?.context?.token;
    const message = req.body?.context?.typedMessage;
    const { signature, address } = token;

    if (!address || address !== adminWallet)
      return res.status(401).json({ message: NOT_ADMIN_WALLET });

    if (!signature)
      return res.status(401).json({ message: MISSING_ADMIN_SIGNATURE });

    if (!(await siweMessageService.decodeMessage(message, signature?.toString(), adminWallet)))
      return res.status(401).json({ message: NOT_AN_ADMIN });

    return handler(req, res);
  }
}