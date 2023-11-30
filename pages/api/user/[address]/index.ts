import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {Logger} from "services/logging";

import {getUserByAddress} from "server/common/user/get-user-by-address";

async function getUserAddressHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await getUserByAddress(req));
      break;
    default:
      res.status(405);
      break;
    }
  } catch (error) {
    Logger.error(error, "Failed on getUserAddressHandler");
  }
}

Logger.changeActionName("GetUserAddressHandler");
export default UserRoute(getUserAddressHandler)