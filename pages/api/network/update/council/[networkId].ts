import { NextApiRequest, NextApiResponse } from "next";

import { withGovernor, withProtected } from "middleware";
import { WithValidChainId } from "middleware/with-valid-chain-id";

import get from "server/common/network/update/council/get";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    await get(req, res);
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withProtected(WithValidChainId(withGovernor(handler)));
