import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {withCORS} from "middleware";

import {HttpNotFoundError} from "../../../../server/errors/http-errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const headerInformation = await models.headerInformation.findAll({});

  if (!headerInformation)
    throw new HttpNotFoundError("header information not found");

  return headerInformation[0];
}

async function SearchNetworks(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req, res));
    break;

  default:
    res.status(405);
    break;
  }

  res.end();
}

export default withCORS(SearchNetworks);
