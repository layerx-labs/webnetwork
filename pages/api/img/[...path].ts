import {NextApiRequest, NextApiResponse} from "next";

import {LogAccess} from "../../../middleware/log-access";
import {getImageProxyUrl} from "../../../server/common/img/get-image-proxy-url";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(302).redirect(getImageProxyUrl(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default LogAccess(handler)