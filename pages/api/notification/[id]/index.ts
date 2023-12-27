import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "middleware";

import {Logger} from "services/logging";

import {deleteNotification} from "server/common/notifications/delete-notification";

async function singleNotificationHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "delete":
      res.status(200).json(await deleteNotification(req));
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `delete notification ${req?.query?.id}`);
    res.status(e?.status || 500).json({message: e?.message || e?.toString()});
  }
}

Logger.changeActionName("DeleteNotification");
export default UserRoute(WithValidChainId(singleNotificationHandler));