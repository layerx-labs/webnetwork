import { NextApiRequest, NextApiResponse } from "next";
import get from "server/common/comments/get";
import patch from "server/common/comments/patch";

import { LogAccess } from "middleware/log-access";
import { NetworkRoute } from "middleware/network-route";
import { WithValidChainId } from "middleware/with-valid-chain-id";
import WithCors from "middleware/withCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    await get(req, res);
    break;
  case "PATCH":
    await patch(req, res);
    break;

  default:
    res.status(405);
  }

  res.end();
}
export default LogAccess(WithCors(WithValidChainId(NetworkRoute(handler))));
