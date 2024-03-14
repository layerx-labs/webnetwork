import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute, NetworkRoute, WithValidChainId} from "middleware";

import {Logger} from "services/logging";

import {get, post, put} from "server/common/marketplace";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;
  case "post":
    res.status(200).json(await post(req));
    break;
  case "put":
    res.status(200).json(await put(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}


export default UserRoute(WithValidChainId(NetworkRoute(handler)));
