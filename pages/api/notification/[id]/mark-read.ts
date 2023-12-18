import {NextApiRequest, NextApiResponse} from "next";

import { withUser } from "middleware/with-user";

import {WithValidChainId, withProtected} from "../../../../middleware";
import {markNotificationRead} from "../../../../server/common/notifications/mark-notification-read";
import {Logger} from "../../../../services/logging";

async function markNotificationAsRead(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "put":
      res.status(200).json(await markNotificationRead(req));
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, `mark notification ${req?.query?.id}`);
    res.status(e?.status || 500).json({message: e?.message || e?.toString()});
  }
}

Logger.changeActionName("MarkNotificationRead");
export default withProtected(withUser(WithValidChainId(markNotificationAsRead), []));
