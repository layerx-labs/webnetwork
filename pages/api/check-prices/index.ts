import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";

import {error as LogError} from "services/logging";

import post from "server/common/check-prices/post";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
    case "POST":
      res.status(200).json(await post(req));
      break;

    default:
      res.status(405);
    }
  } catch (error) {
    LogError(error);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }

  res.end();
}

export default withCORS(handler);