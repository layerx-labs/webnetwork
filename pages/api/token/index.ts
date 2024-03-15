import {NextApiRequest, NextApiResponse} from "next";

import {AdminRoute} from "middleware";

import {post} from "server/common/token";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await post(req));
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default AdminRoute(handler);
