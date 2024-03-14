import {NextApiRequest, NextApiResponse} from "next";

import {AdminRoute} from "middleware";

import {error as LogError} from "services/logging";

import {get, post} from "server/common/chain";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
  } catch (error) {
    LogError(`Failed to get or post chains`, error);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }
  res.end();
}

export default AdminRoute(handler);