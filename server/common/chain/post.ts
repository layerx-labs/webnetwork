import { NextApiRequest } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { MiniChainInfo } from "interfaces/mini-chain";

import { HttpBadRequestError, HttpConflictError } from "server/errors/http-errors";

export async function post(req: NextApiRequest) {
  const body = req.body as MiniChainInfo & { isDefault: boolean; };

  const missingValues = [
    [body.chainId, "chainId"],
    [body.name, "name"],
    [body.shortName, "shortName"],
    [body.activeRPC, "rpc"],
    [body.nativeCurrency?.name, "currencyName"],
    [body.nativeCurrency?.symbol, "currencySymbol"],
    [body.nativeCurrency?.decimals, "currencyDecimals"],
    [body.eventsApi, "eventsUrl"],
    [body.explorer, "blockExplorer"],
  ]
    .filter(([value]) => !value)
    .map(([,error]) => error);

  if (missingValues.length)
    throw new HttpBadRequestError(`Missing parameters: ${missingValues.join(", ")}`);

  const model = {
    chainId: body.chainId,
    chainRpc: body.activeRPC,
    chainName: body.name,
    chainShortName: body.shortName,
    chainCurrencySymbol: body.nativeCurrency?.symbol,
    chainCurrencyName: body.nativeCurrency?.name,
    chainCurrencyDecimals: body.nativeCurrency?.decimals,
    isDefault: body.isDefault,
    blockScanner: body.explorer,
    eventsApi: body.eventsApi,
    color: body.color,
    icon: body.icon
  };

  const existentChain = await models.chain.findOne({
    where: {
      chainId: { [Op.eq]: model.chainId }
    }
  });

  if (existentChain)
    throw new HttpConflictError("Chain already exists");

  const createdChain = await models.chain.create(model);

  return createdChain;
}