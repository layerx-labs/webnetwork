import {NextApiRequest, NextApiResponse} from "next";

import {getPointsBase} from "server/common/points/get-points-base";

import WithCors from "../../../../middleware/withCors";

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

export default WithCors(handler);