import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute, withCORS, WithValidChainId } from "middleware";

import get from "server/common/deliverable/get";
import post from "server/common/deliverable/post";


async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    await get(req, res);
    break;
  case "POST":
    await post(req, res);
    break;

  default:
    res.status(405);
  }

  res.end();
}
export default UserRoute(WithValidChainId(handler));
