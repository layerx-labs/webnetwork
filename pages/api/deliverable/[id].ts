import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute, withCORS, WithValidChainId } from "middleware";

import del from "server/common/deliverable/delete";



async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "DELETE":
    await del(req, res);
    break;
  default:
    res.status(405);
  }

  res.end();
}
export default UserRoute(WithValidChainId(handler));