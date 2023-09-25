import { NextApiRequest, NextApiResponse } from "next";

import { AdminRoute } from "middleware";

import { error as LogError } from "services/logging";

import { post } from "server/common/token";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "post":
      res.status(200).json(await post(req));
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
