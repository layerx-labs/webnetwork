import { NextApiRequest, NextApiResponse } from "next";

import { LogAccess } from "middleware/log-access";
import WithCors from "middleware/withCors";

import { error as LogError } from "services/logging";

import get from "server/common/search/leaderboard";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
    case "GET":
      res.status(200).json(await get(req.query));
      break;

    default:
      res.status(405);
    }
  } catch (error) {
    LogError(error);
    res.status(500).json(error);
  }

  res.end();
}
export default LogAccess(WithCors(handler));