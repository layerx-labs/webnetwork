import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { updateUserFullName } from "server/common/user/update-user-full-name";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await updateUserFullName(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(handler);