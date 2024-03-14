import {NextApiRequest, NextApiResponse} from "next";

import {withCORS} from "middleware";

import get from "server/common/health/get";


export async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default withCORS(handler);