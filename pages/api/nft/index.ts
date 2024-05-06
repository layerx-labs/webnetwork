import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "middleware";

import {post} from "server/common/nft";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await post(req));
    break;
  default:
    res.status(405);
  }

  res.end();
}

export default UserRoute(WithValidChainId(handler));
