import {NextApiRequest, NextApiResponse} from "next";

import {withGovernor, withProtected, WithValidChainId} from "middleware";

import deleteEntry from "server/common/marketplace/management/allow-list/delete";
import get from "server/common/marketplace/management/allow-list/get";
import post from "server/common/marketplace/management/allow-list/post";

async function handler (req: NextApiRequest, res: NextApiResponse) {

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

  res.end();
}

export default withProtected(WithValidChainId(withGovernor(handler, ["GET", "DELETE"])));