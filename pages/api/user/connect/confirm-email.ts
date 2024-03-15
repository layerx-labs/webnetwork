import {NextApiRequest, NextApiResponse} from "next";

import {withCORS} from "middleware";

import {get} from "server/common/user/email";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method.toLowerCase()) {
  case "get":
    await get(req)
    res.redirect("/profile?emailVerification=success");
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default withCORS(handler);