import {NextApiRequest, NextApiResponse} from "next";

import {GovernorRoute, withCORS} from "middleware";

import patch from "server/common/comments/patch";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "PATCH":
    res.status(200).json(await patch(req, res));
    break;

  default:
    res.status(405);
  }

  res.end();
}
export default withCORS(GovernorRoute(handler));
