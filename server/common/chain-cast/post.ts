import { NextApiRequest } from "next";

import { HttpBadRequestError } from "server/errors/http-errors";
import { addToChainCast } from "server/helpers/add-to-chain-cast";
import { isAddress } from "server/utils/validators";

export async function chainCastPost(req: NextApiRequest) {
  const operation = req.query?.operation?.toString();
  const { address, startBlock, chainId } = req.body;

  const AllowedOperations = ["add-registry", "add-network"];

  if (!operation || !AllowedOperations.includes(operation))
    throw new HttpBadRequestError("Invalid operation");

  if ([address, startBlock, chainId].some(v => !v))
    throw new HttpBadRequestError("Missing parameters");

  if (!isAddress(address))
    throw new HttpBadRequestError("Invalid address");

  const type = {
    "add-registry": "registry" as const,
    "add-network": "network" as const,
  }[operation];

  const result = await addToChainCast(type, address, +chainId, +startBlock)

  return result;
}