import {NextApiRequest, NextApiResponse} from "next";

import {withCORS} from "middleware";

import {getUserPointsHistory} from "server/common/user/get-user-points-history";

async function userSocials(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getUserPointsHistory(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default withCORS(userSocials);