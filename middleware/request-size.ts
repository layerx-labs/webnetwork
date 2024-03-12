import {NextApiHandler, NextApiRequest} from "next";

import {HttpForbiddenError} from "../server/errors/http-errors";

export const MaxRequestSize = (handler: NextApiHandler, limitSize = 500 /* in kb */) => {
  return (req: NextApiRequest, res) => {
    const queryLength = Buffer.from(JSON.stringify(req.query??{})).length;
    const bodyLength = Buffer.from(JSON.stringify(req.body??{})).length;

    if ((queryLength + bodyLength)/1024 >= limitSize)
      throw new HttpForbiddenError("Exceeds limit");

    return handler(req, res);
  }
}