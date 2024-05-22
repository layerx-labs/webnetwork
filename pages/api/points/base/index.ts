import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { getPointsBase } from "server/common/points/get-points-base";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getPointsBase());
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(handler, []);