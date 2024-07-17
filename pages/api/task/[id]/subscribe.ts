import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { subscribeToTask } from "server/common/task/subscribe";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "PUT":
    res.status(200).json(await subscribeToTask(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(handler);
