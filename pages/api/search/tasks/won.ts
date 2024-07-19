import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";
import { WithValidChainId } from "middleware/with-valid-chain-id";

import searchTasksWon from "server/common/search/tasks-won";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await searchTasksWon(req.query));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(WithValidChainId(handler));