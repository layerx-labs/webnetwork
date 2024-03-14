import { NextApiRequest } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { handleCreateSettlerToken } from "helpers/handleNetworkTokens";

import { HttpBadRequestError, HttpConflictError, HttpNotFoundError } from "server/errors/http-errors";

export async function post(req: NextApiRequest) {
  const { address, minAmount, chainId } = req.body;

  if ([address, minAmount, chainId ].some(p => !p))
    throw new HttpBadRequestError("Missing parameters");

  const chain = await models.chain.scope("internal").findOne({
    where: {
      chainId: {
        [Op.eq]: chainId
      }
    }
  });

  if (!chain)
    throw new HttpNotFoundError("Chain not found");

  const existentToken = await models.tokens.findOne({
    where: {
      address: caseInsensitiveEqual("address", address),
      chain_id: chainId
    }
  });

  if (existentToken)
    throw new HttpConflictError("Token already saved");

  return handleCreateSettlerToken(address, minAmount, chain.privateChainRpc, chain.chainId);
}