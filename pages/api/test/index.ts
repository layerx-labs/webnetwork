import {NextApiRequest, NextApiResponse} from "next";

import {LogAccess} from "../../../middleware/log-access";
import {HttpBadRequestError} from "../../../server/errors/http-errors";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  throw new HttpBadRequestError("tested")


  res.status(200).json({message: "ok"})
  res.end();
}

export default LogAccess(handler)