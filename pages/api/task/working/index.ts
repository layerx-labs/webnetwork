import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import put from "server/common/task/start-working/put";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await put(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}


export default UserRoute(handler);
