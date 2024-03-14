import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {error as LogError} from "services/logging";

import {HttpNotFoundError} from "../../../../errors/http-errors";

export default async function get(req: NextApiRequest, res: NextApiResponse) {

  const {id} = req.query;

  if (!id)
    throw new HttpNotFoundError("id not found");

  const network = await models.network.findOne({
    where: {
      id: +id
    }
  })

  if (!network)
    throw new HttpNotFoundError("network not found")

  return network.banned_domains;

}
