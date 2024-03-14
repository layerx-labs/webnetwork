import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {changeUserHandle} from "server/common/user/change-user-handle";

async function changeUserHandleHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(!(await changeUserHandle(req)))
    break;
  default:
    res.status(405);
  }

}


export default UserRoute(changeUserHandleHandler);