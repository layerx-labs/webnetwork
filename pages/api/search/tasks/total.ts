import {NextApiRequest, NextApiResponse} from "next";

import {RouteMiddleware} from "middleware";
import {WithValidChainId} from "middleware/with-valid-chain-id";

import {error as LogError} from "services/logging";

import getTotalUsers from "../../../../server/common/search/total";

async function getAll(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await getTotalUsers(req.query))
      break;

    default:
      res.status(405);
    }
  } catch (e) {
    LogError(e);
    res.status(500).json(e);
  }


  res.end();
}

export default RouteMiddleware(WithValidChainId(getAll));
