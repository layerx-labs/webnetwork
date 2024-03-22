import {NextApiRequest, NextApiResponse} from "next";

import {LogAccess} from "middleware/log-access";

async function Seo(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(400).json({message: "discontinuated"})
    break;

  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
}

export default LogAccess(Seo);