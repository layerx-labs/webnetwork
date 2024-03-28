import { NextApiRequest, NextApiResponse } from "next";

import { AdminRoute } from "middleware";

import { chainCastPost } from "server/common/chain-cast/post";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "POST":
    res.status(200).json(await chainCastPost(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default AdminRoute(handler);