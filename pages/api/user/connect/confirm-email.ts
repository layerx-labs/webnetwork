import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";

import { Logger } from "services/logging";

import { get } from "server/common/user/email";
import { HttpBadRequestError, HttpConflictError } from "server/errors/http-errors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = "/dashboard?emailVerification=";

  switch (req.method.toLowerCase()) {
  case "get":
    try {
      await get(req);
      res.redirect(`${url}success`);
    } catch(error) {
      Logger.error(error, "Failed to confirm email", {
        query: req.query,
        url: req.url,
        method: req.method,
        cookies: req.cookies,
        headers: req.headers
      });

      if (error instanceof HttpBadRequestError || error instanceof HttpConflictError) {
        res.redirect(`${url}${error.message}`);
      } else 
        res.redirect(`${url}server-error`);
    }
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(handler);