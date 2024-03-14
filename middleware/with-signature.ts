import {NextApiHandler} from "next";

import {INVALID_SIGNATURE} from "helpers/error-messages";
import {getSiweMessage, verifySiweSignature} from "helpers/siwe";

import {isMethodAllowed} from "server/utils/http";


export const withSignature = (handler: NextApiHandler, allowedMethods = ['GET']): NextApiHandler => {
  return async (req, res) => {
    if (isMethodAllowed(req.method, allowedMethods))
      return handler(req, res);

    const token = req.body?.context?.token;

    const { issuedAt, expiresAt, signature, address, nonce } = token;

    const siweMessage = getSiweMessage({
      nonce,
      address,
      issuedAt: +issuedAt,
      expiresAt: +expiresAt
    });

    if (!(await verifySiweSignature(siweMessage, signature?.toString(), nonce)))
      return res.status(401).json({ message: INVALID_SIGNATURE });

    req.body = {
      ...req.body,
      context: {
        ...req.body?.context,
        siweMessage
      }
    };
  
    return handler(req, res);
  };
};
