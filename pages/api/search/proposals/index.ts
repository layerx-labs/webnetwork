import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";
import { WithValidChainId } from "middleware/with-valid-chain-id";

import { error as LogError } from "services/logging";

import get from "server/common/search/proposals";

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
export default withCORS(WithValidChainId(handler));