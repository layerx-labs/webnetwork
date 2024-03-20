import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, WithValidChainId} from "middleware";

import {error as LogError} from "services/logging";

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
