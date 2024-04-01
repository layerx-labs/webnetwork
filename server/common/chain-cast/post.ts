import { NextApiRequest } from "next";

import { ChainCastErrors } from "server/errors/error-messages";
import { HttpBadRequestError } from "server/errors/http-errors";
import { addToChainCast } from "server/helpers/add-to-chain-cast";
import { isAddress } from "server/utils/validators";

export async function chainCastPost(req: NextApiRequest) {
  const operation = req.query?.operation?.toString();
  const { address, startBlock, chainId } = req.body;

  const AllowedOperations = ["add-registry", "add-network"];

  if (!operation || !AllowedOperations.includes(operation))
    throw new HttpBadRequestError(ChainCastErrors.InvalidOperation);

  if ([address, startBlock, chainId].some(v => !v))
    throw new HttpBadRequestError(ChainCastErrors.MissingParameters);

  if (!isAddress(address))
    throw new HttpBadRequestError(ChainCastErrors.InvalidAddress);

  const type = {
    "add-registry": "registry" as const,
    "add-network": "network" as const,
  }[operation];

  const result = await addToChainCast(type, address, +chainId, +startBlock)

  return result;
}