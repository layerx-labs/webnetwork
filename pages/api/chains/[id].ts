import {NextApiRequest, NextApiResponse} from "next";

import {AdminRoute} from "middleware";

import {del, patch} from "server/common/chain";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "patch":
    res.status(200).json(await patch(req));
    break;
  case "delete":
    res.status(200).json(await del(req));
    break;
  default:
    res.status(405);
  }
  
  res.end();
}

export default AdminRoute(handler);