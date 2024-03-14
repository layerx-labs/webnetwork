import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {error as LogError} from "services/logging";

import {BadRequestErrors} from "../../../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpNotFoundError} from "../../../../errors/http-errors";

export default async function patch(req: NextApiRequest, res: NextApiResponse) {

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

  if (!network.banned_domains.find((domain) => domain === banned_domain))
    throw new HttpNotFoundError("banned_domain not found")

  network.banned_domains = network.banned_domains.filter((domain) => domain !== banned_domain)
  await network.save();

  return res.status(200).json(network.banned_domains);

}
