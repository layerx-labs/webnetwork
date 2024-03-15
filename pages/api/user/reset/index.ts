import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {patch} from "server/common/user/reset";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "patch":
    res.status(200).json(await patch(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(handler);
