import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {getUserByHandle} from "server/common/user/get-user-by-handle";

async function checkHandleFreeHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getUserByHandle(req))
    break;
  default:
    res.status(405);
  }

}


export default UserRoute(checkHandleFreeHandler);