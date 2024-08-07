import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { unsubscribeOfTask } from "server/common/task/unsubscribe";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "PUT":
    res.status(200).json(await unsubscribeOfTask(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(handler);
