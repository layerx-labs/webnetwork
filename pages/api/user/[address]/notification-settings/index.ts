import { NextApiRequest, NextApiResponse } from "next";

import { UserRoute } from "middleware";

import { getUserNotificationSettings } from "server/common/user/get-user-notification-settings";
import { updateNotificationSettings } from "server/common/user/update-notification-settings";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json((await getUserNotificationSettings(req)));
    break;
  case "put":
    res.status(200).json(await updateNotificationSettings(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(handle, []);