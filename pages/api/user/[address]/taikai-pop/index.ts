import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {getUserTaikaiPop} from "server/common/user/get-user-taikai-pop";

async function userTaikaiPop(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getUserTaikaiPop(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(userTaikaiPop);