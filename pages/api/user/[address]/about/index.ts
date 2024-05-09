import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {updateUserAbout} from "server/common/user/update-user-about";

async function userSocials(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await updateUserAbout(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(userSocials);