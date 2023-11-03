import { isZeroAddress } from "ethereumjs-util";
import { NextApiRequest } from "next";
import { isAddress } from "web3-utils";

import models from "db/models";

import { isHttps, isValidUrl } from "helpers/validateUrl";

import { HttpBadRequestError, HttpNotFoundError } from "server/errors/http-errors";

export async function patch(req: NextApiRequest) {
  const { id } = req.query;
  const {
    registryAddress,
    eventsApi,
    explorer,
    lockAmountForNetworkCreation,
    networkCreationFeePercentage,
    closeFeePercentage,
    cancelFeePercentage,
  } = req.body;

  if (!id)
    throw new HttpBadRequestError("Missing chainId");

  if ([registryAddress, eventsApi, explorer].every(p => !p))
    throw new HttpBadRequestError("Missing parameters to update");

  const chain = await models.chain.findOne({
    where: { chainId: id }
  });

  if (!chain)
    throw new HttpNotFoundError("Chain not found");

  if (registryAddress) {
    if (!isAddress(registryAddress) || isZeroAddress(registryAddress))
      throw new HttpBadRequestError("Invalid registry address provided");

    chain.registryAddress = registryAddress;
  }

  if (eventsApi) {
    if (!isValidUrl(eventsApi) && !isHttps(eventsApi)) 
      throw new HttpBadRequestError("Invalid events url provided");

    chain.eventsApi = eventsApi;
  }

  if (explorer) {
    if (!isValidUrl(explorer) && !isHttps(explorer))
      throw new HttpBadRequestError("Invalid block explorer url provided");

    chain.blockScanner = explorer;
  }

  if (lockAmountForNetworkCreation) chain.lockAmountForNetworkCreation = lockAmountForNetworkCreation;
  if (networkCreationFeePercentage) chain.networkCreationFeePercentage = networkCreationFeePercentage;
  if (closeFeePercentage) chain.closeFeePercentage = closeFeePercentage;
  if (cancelFeePercentage) chain.cancelFeePercentage = cancelFeePercentage;

  await chain.save();

  return "Chain updated"
}