import { isZeroAddress } from "ethereumjs-util";
import { NextApiRequest } from "next";
import { isAddress } from "web3-utils";

import models from "db/models";

import { isValidUrl } from "helpers/validateUrl";

import { HttpBadRequestError, HttpNotFoundError } from "server/errors/http-errors";

export async function patch(req: NextApiRequest) {
  const { chainId } = req.body;

  if (!chainId)
    throw new HttpBadRequestError("Missing chainId");

  const chain = await models.chain.findOne({
    where: { chainId: chainId }
  });

  if (!chain)
    throw new HttpNotFoundError("Chain not found");

  if (req.body.registryAddress) {
    if (!isAddress(req.body.registryAddress) || isZeroAddress(req.body.registryAddress))
      throw new HttpBadRequestError("Invalid registry address provided");

    chain.registryAddress = req.body.registryAddress;
  }

  if (req.body.eventsApi) {
    if (!isValidUrl(req.body.eventsApi) && !req.body.eventsApi.includes("https://"))
      throw new HttpBadRequestError("Invalid events url provided");

    chain.eventsApi = req.body.eventsApi;
  }

  if (req.body.explorer) {
    if (!isValidUrl(req.body.explorer) && !req.body.explorer.includes("https://"))
      throw new HttpBadRequestError("Invalid block explorer url provided");

    chain.blockScanner = req.body.explorer;
  }

  await chain.save();

  return "Chain updated"
}