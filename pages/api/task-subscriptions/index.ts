import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {listSubscriptions} from "server/common/task/list-subscriptions";


async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await listSubscriptions(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(handler, []);