import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "../../../middleware";
import {getNotifications} from "../../../server/common/notifications/get-notifications";
import {Logger} from "../../../services/logging";

async function allNotificationsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await getNotifications(req))
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `get notifications for ${req?.query?.address}`);
    res.status(e?.status || 500).json({message: e?.message || e?.toString()});
  }
}

export default UserRoute(WithValidChainId(allNotificationsHandler));