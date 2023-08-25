import { NextApiRequest, NextApiResponse } from "next";

import { withGovernor, withProtected } from "middleware";

import get from "server/common/network/management/banned-words/get";
import post from "server/common/network/management/banned-words/post";

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
export default withProtected(withGovernor(handler));
