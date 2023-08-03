import { NextApiRequest, NextApiResponse } from "next";
import get from "server/common/comments/get";
import patch from "server/common/comments/patch";

import { LogAccess } from "middleware/log-access";
import { NetworkRoute } from "middleware/network-route";
import { WithValidChainId } from "middleware/with-valid-chain-id";
import WithCors from "middleware/withCors";

import { error as LogError } from "services/logging";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
    case "GET":
      res.status(200).json(await get(req));
      break;
    case "PATCH":
      res.status(200).json(await patch(req));
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
export default LogAccess(WithCors(WithValidChainId(NetworkRoute(handler))));