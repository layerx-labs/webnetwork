import { NextApiRequest, NextApiResponse } from "next";

import { AdminRoute } from "middleware";

import { get} from "server/common/points-base";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get());
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default AdminRoute(handler, []);