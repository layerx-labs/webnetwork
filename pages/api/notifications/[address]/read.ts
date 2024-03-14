import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {markAllNotificationsRead} from "server/common/notifications/mark-all-read";

async function markAllNotificationsAsReadHandler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await markAllNotificationsRead(req))
    break;
  default:
    break;
  }


  res.end();
}


export default UserRoute(markAllNotificationsAsReadHandler);