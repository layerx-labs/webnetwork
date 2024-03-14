import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "middleware";

import del from "server/common/deliverable/delete";
import get from "server/common/deliverable/get";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await get(req, res));
    break;
  case "DELETE":
    res.status(200).json(await del(req, res));
    break;
  default:
    res.status(405);
  }

  res.end();
}
export default UserRoute(WithValidChainId(handler));
