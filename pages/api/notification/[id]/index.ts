import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "middleware";

import {Logger} from "services/logging";

import {deleteNotification} from "server/common/notifications/delete-notification";

async function singleNotificationHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "delete":
    res.status(200).json(await deleteNotification(req));
    break;
  default:
    res.status(405);
  }

  res.end()
}


export default UserRoute(WithValidChainId(singleNotificationHandler));