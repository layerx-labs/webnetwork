import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {MiniChainInfo} from "interfaces/mini-chain";

import DAO from "services/dao-service";

import {HttpBadRequestError, HttpConflictError} from "server/errors/http-errors";

export async function post(req: NextApiRequest) {
  const body = req.body as MiniChainInfo & { isDefault: boolean; };

  const missingValues = [
    [body.chainId, "chainId"],
    [body.name, "name"],
    [body.shortName, "shortName"],
    [body.activeRPC, "rpc"],
    [body.privateRpc, "privateRpc"],
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

  let dao: DAO;

  try {
    dao = new DAO({
      skipWindowAssignment: true,
      web3Host: body.activeRPC,
    });

    await dao.start();
  } catch (e) {
    throw new HttpBadRequestError(`Failed to connect with ${body.activeRPC}`)
  }

  const model = {
    chainId: body.chainId,
    chainRpc: body.activeRPC,
    privateChainRpc: body.privateRpc,
    chainName: body.name,
    chainShortName: body.shortName,
    chainCurrencySymbol: body.nativeCurrency?.symbol,
    chainCurrencyName: body.nativeCurrency?.name,
    chainCurrencyDecimals: body.nativeCurrency?.decimals,
    isDefault: body.isDefault,
    blockScanner: body.explorer,
    eventsApi: body.eventsApi,
    color: body.color,
    icon: body.icon,
    startBlock: (await dao.web3Connection.Web3.eth.getBlock("latest")).number
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