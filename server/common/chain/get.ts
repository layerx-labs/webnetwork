import { NextApiRequest } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { SupportedChainData } from "interfaces/supported-chain-data";

export async function get(req: NextApiRequest): Promise<SupportedChainData[]> {
  const query = req.query;

  const where = {
    ... query.chainId ? {chainId: {[Op.eq]: query.chainId}} : {},
    ... query.name ? {chainName: {[Op.iLike]: query.name}} : {},
    ... query.shortName ? {chainShortName: {[Op.iLike]: query.shortName}} : {},
    ... query.chainRpc ? {chainRpc: {[Op.iLike]: query.chainRpc}} : {},
    ... query.nativeCurrencyName ? {chainCurrencyName: {[Op.iLike]: query.nativeCurrencyName}} : {},
    ... query.nativeCurrencySymbol ? {chainCurrencySymbol: {[Op.iLike]: query.nativeCurrencySymbol}} : {},
    ... query.nativeCurrencyDecimals ? {chainCurrencyDecimals: {[Op.eq]: query.nativeCurrencyDecimals}} : {}
  }

  const chains = await models.chain.findAll({
    where,
    include: [
      {
        association: "networks",
        attributes: ["name", "networkAddress", "colors", "logoIcon", "fullLogo"]
      }
    ]
  });

  return chains;
}