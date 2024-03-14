import {NextApiRequest, NextApiResponse} from "next";

import {RouteMiddleware} from "middleware";

import {error as LogError} from "services/logging";

import get from "server/common/proposal";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {
  case "GET":
    res.status(200).json(await get(req.query));
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default RouteMiddleware(handler);