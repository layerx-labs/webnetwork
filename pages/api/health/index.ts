import {NextApiRequest, NextApiResponse} from "next";

import { withCORS } from "middleware";

import {Logger} from "services/logging";

import get from "server/common/health/get";

Logger.changeActionName(`Health`);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await get(req));
      break;

    default:
      res.status(405);
    }
  } catch (error) {
    Logger.error(error, "health endpoint error", req);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }

  res.end();
}

export default withCORS(handler);