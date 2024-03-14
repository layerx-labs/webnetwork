import {NextApiRequest, NextApiResponse} from "next";

import {withUser} from "middleware/with-user";

import {withProtected, WithValidChainId} from "../../../../middleware";
import {markNotificationRead} from "../../../../server/common/notifications/mark-notification-read";

async function markNotificationAsRead(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await markNotificationRead(req));
    break;
  default:
    res.status(405);
  }


  res.end();
}


export default withProtected(withUser(WithValidChainId(markNotificationAsRead), []));
