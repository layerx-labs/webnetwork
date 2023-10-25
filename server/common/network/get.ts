import { NextApiRequest } from "next";
import { Op, Sequelize } from "sequelize";

import Database from "db/models";
import Network from "db/models/network.model";

import { chainFromHeader } from "helpers/chain-from-header";
import { caseInsensitiveEqual } from "helpers/db/conditionals";

import { HttpNotFoundError } from "server/errors/http-errors";

export async function get(req: NextApiRequest): Promise<Network> {
  const { name: networkName, creator: creatorAddress, isDefault, address, byChainId, chainName } = req.query;

  const chain = await chainFromHeader(req);

  const isTrue = (value: string) => value === "true";

  const where = {
    ... isTrue(byChainId?.toString()) && chain ? { chain_id: { [Op.eq]: +chain?.chainId } } : {},
    ... networkName && {
      name: {
        [Op.iLike]: String(networkName)
      }
    } || {},
    ... creatorAddress && {
      creatorAddress: caseInsensitiveEqual("creatorAddress", creatorAddress.toString())
    } || {},
    ... isDefault && {
      isDefault: isTrue(isDefault.toString())
    } || {},
    ... address && {
      networkAddress: caseInsensitiveEqual("networkAddress", address.toString()),
    } || {}
  };

  const network = await Database.network.findOne({
    attributes: { exclude: ["creatorAddress", "updatedAt"] },
    include: [
      { association: "tokens" },
      { association: "curators" },
      { association: "networkToken" },
      { 
        association: "chain",
        required: !!chainName,
        ... chainName ? {
          where: {
            chainShortName: caseInsensitiveEqual("chain.chainShortName", chainName.toString())
          },
        }: {},
      }
    ],
    where
  });
  
  if (!network)
    throw new HttpNotFoundError("Network not found");

  return network;
}