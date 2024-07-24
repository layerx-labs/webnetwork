import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import get from "server/common/comments/get";
import post from "server/common/comments/post";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await get(req));
    break;
  case "POST":
    res.status(200).json(await post(req, res));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(handler);