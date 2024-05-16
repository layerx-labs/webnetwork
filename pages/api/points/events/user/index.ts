import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { getEventsOfUser } from "server/common/points/get-events-of-user";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getEventsOfUser(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(handler, []);