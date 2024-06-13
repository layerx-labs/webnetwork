import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";

import { getPointsLeaderboard } from "server/common/points";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getPointsLeaderboard(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default withCORS(handler);