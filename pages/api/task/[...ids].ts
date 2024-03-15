import {NextApiRequest, NextApiResponse} from "next";

import {IssueRoute} from "middleware";

import {get, put} from "server/common/task";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;

  case "put":
    res.status(200).json(await put(req));
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default IssueRoute(handler);