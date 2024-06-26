import {NextApiRequest, NextApiResponse} from "next";

import {withGovernor, withProtected} from "middleware";
import {WithValidChainId} from "middleware/with-valid-chain-id";

import get from "server/common/marketplace/management/banned-words/get";
import patch from "server/common/marketplace/management/banned-words/patch";
import post from "server/common/marketplace/management/banned-words/post";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await get(req, res));
    break;
  case "POST":
    res.status(200).json(await post(req, res));
    break;
  case "PATCH":
    res.status(200).json(await patch(req, res));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withProtected(WithValidChainId(withGovernor(handler)));
