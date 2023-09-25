import { NextApiRequest } from "next";

import models from "db/models";

import { HttpBadRequestError, HttpNotFoundError } from "server/errors/http-errors";

export async function del(req: NextApiRequest) {
  const { id } = req.query;

  if (!id)
    throw new HttpBadRequestError("Missing id");

  const found = await models.chain.findOne({
    where: { chainId: +id.toString() }
  });

  if (!found)
    throw new HttpNotFoundError("Chain not found");

  await found.destroy();

  return "Chain deleted";
}