import {NextApiRequest, NextApiResponse} from "next";

import {withGovernor, withProtected} from "middleware";
import {NetworkRoute} from "middleware/network-route";
import {WithValidChainId} from "middleware/with-valid-chain-id";

import {put} from "server/common/marketplace/management";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "put":
    res.status(200).json(await put(req));
    break;

  default:
    res.status(405);
  }


  res.end();
}


export default withProtected(WithValidChainId(withGovernor(NetworkRoute(handler))));
