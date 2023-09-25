import { NextApiRequest, NextApiResponse } from "next";

import { AdminRoute } from "middleware";

import { error as LogError } from "services/logging";

import { patch, del } from "server/common/chain";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
  } catch (error) {
    LogError(error);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }
  res.end();
}

export default AdminRoute(handler);