import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {Logger} from "services/logging";

import {changeUserHandle} from "server/common/user/change-user-handle";

async function changeUserHandleHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(!(await changeUserHandle(req)))
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `Failed at changeUserHandleHandler`);
  }
}

Logger.changeActionName("UserHandleHandler");
export default UserRoute(changeUserHandleHandler);