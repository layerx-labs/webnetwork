import {NextApiRequest, NextApiResponse} from "next";

import {withCORS, withJWT} from "../../../../middleware";
import {withSignature} from "../../../../middleware/with-signature";
import {withUser} from "../../../../middleware/with-user";
import {getNotifications} from "../../../../server/common/notifications/get-notifications";
import {Logger} from "../../../../services/logging";

async function allNotificationsHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getNotifications(req))
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(withJWT(withSignature(withUser(allNotificationsHandler, []), []), []))