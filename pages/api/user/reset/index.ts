import { NextApiRequest, NextApiResponse } from "next";

import { withProtected } from "middleware";

import { error as LogError } from "services/logging";

import { patch } from "server/common/user/reset";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "patch":
      res.status(200).json(await patch(req));
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
export default withProtected(handler);
