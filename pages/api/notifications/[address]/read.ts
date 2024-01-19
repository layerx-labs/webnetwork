import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {Logger} from "services/logging";

import {markAllNotificationsRead} from "server/common/notifications/mark-all-read";

async function markAllNotificationsAsReadHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "put":
      res.status(200).json(await markAllNotificationsRead(req))
      break;
    default:
      break;
    }
  } catch (e) {
    Logger.error(e, `mark notifications of ${req?.query?.address} read`);
    res.status(e?.status || 500).json({message: e?.message || e?.toString()});
  }
}

Logger.changeActionName("MarkAllNotificationsAsReadHandler");
export default UserRoute(markAllNotificationsAsReadHandler);