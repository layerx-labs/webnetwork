import {NextApiRequest, NextApiResponse} from "next";

import {AdminRoute} from "middleware";

import {get, post} from "server/common/chain";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;
  case "post":
    res.status(200).json(await post(req));
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default AdminRoute(handler);