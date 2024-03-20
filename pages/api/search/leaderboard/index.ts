import {NextApiRequest, NextApiResponse} from "next";

import {withCORS} from "middleware";

import get from "server/common/search/leaderboard";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {
  case "GET":
    res.status(200).json(await get(req.query));
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default withCORS(handler);