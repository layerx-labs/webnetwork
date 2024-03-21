import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {withCORS} from "middleware";

export async function getTotal() {
  return models.user.count();
}

async function getAll(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await getTotal());
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(getAll);
