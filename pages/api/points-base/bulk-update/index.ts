import { NextApiRequest, NextApiResponse } from "next";

import { AdminRoute } from "middleware";

import { bulkUpdatePointsBase } from "server/common/points-base/bulk-update/bulk-update-points-base";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await bulkUpdatePointsBase(req));
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default AdminRoute(handler);