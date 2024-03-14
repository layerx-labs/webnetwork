import {NextApiRequest, NextApiResponse} from "next";

import {RouteMiddleware} from "middleware";
import {WithValidChainId} from "middleware/with-valid-chain-id";

import getTotalUsers from "../../../../server/common/search/total";

async function getAll(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getTotalUsers(req.query))
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default RouteMiddleware(WithValidChainId(getAll));
