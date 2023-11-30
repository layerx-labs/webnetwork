import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {Logger} from "services/logging";

import {getUserByHandle} from "server/common/user/get-user-by-handle";

async function checkHandleFreeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await getUserByHandle(req))
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `Failed at checkHandleFreeHandler`);
  }
}

Logger.changeActionName("UserHandleHandler");
export default UserRoute(checkHandleFreeHandler);