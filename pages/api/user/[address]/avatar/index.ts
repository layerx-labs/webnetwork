import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {updateUserAvatar} from "server/common/user/update-user-avatar";

const UPLOAD_LIMIT_MB = 5;

export const config = {
  api: {
    bodyParser: false,
  }
};

async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await updateUserAvatar(req));
    break;
  default:
    res.status(405);
    break;
  }
}

export default UserRoute(handle);