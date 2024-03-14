import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {BadRequestErrors} from "../../../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpConflictError, HttpNotFoundError} from "../../../../errors/http-errors";

export default async function post(req: NextApiRequest, res: NextApiResponse) {

  const {id} = req.query;
  const {banned_domain} = req.body;

  if (!id || isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters)

  if (!banned_domain)
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters)

  const network = await models.network.findOne({
    where: {
      id: +id,
    },
  });

  if (!banned_domain)
    throw new HttpNotFoundError("banned_domain not found")

  if (network.banned_domains.find((domain) => domain === banned_domain))
    throw new HttpConflictError("domain already exists")


  network.banned_domains = [...network.banned_domains, banned_domain];
  await network.save();

  return network.banned_domains;

}
