import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {getUserByAddress} from "server/common/user/get-user-by-address";

async function getUserAddressHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getUserByAddress(req));
    break;
  default:
    res.status(405);
    break;
  }

}


export default UserRoute(getUserAddressHandler)