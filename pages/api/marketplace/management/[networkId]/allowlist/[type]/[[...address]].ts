import { NextApiRequest, NextApiResponse } from "next";

import { withProtected, WithValidChainId, withGovernor } from "middleware";

import { Logger } from "services/logging";

import deleteEntry from "server/common/marketplace/management/allowlist/delete";
import get from "server/common/marketplace/management/allowlist/get";
import post from "server/common/marketplace/management/allowlist/post";

async function handler (req: NextApiRequest, res: NextApiResponse) {
  Logger.changeActionName(`AllowList`);

  try {
    switch (req.method) {
    case "GET":
      res.status(200).json(await get(req));
      break;
    case "POST":
      res.status(200).json(await post(req));
      break;

    case "DELETE":
      res.status(200).json(await deleteEntry(req));
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `AllowListError`, { method: req.method });
    res.status(e?.status || 500)
      .json({ message: e?.message || e?.toString() });
    return;
  }

  res.end();
}

export default withProtected(WithValidChainId(withGovernor(handler, ["GET", "DELETE"])));