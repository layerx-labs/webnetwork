import {NextApiRequest, NextApiResponse} from "next";

import Database from "db/models";

import {chainFromHeader} from "helpers/chain-from-header";
import {CHAIN_NOT_CONFIGURED, NOT_AN_ADMIN} from "helpers/constants";
import {isAdmin} from "helpers/is-admin";

import {AdminRoute} from "middleware";

import DAO from "services/dao-service";

import {HttpBadRequestError} from "../../../server/errors/http-errors";

async function post(req: NextApiRequest, res: NextApiResponse) {
  const {wallet, registryAddress} = req.body;

  if (!isAdmin(req))
    throw new HttpBadRequestError(NOT_AN_ADMIN)

  const chain = await chainFromHeader(req);
  const web3Host = chain?.privateChainRpc;

  const messages = [
    [wallet, 'Missing wallet address'],
    [registryAddress, 'Missing registry address']
  ].filter(([v,]) => v).map(([, message]) => message);

  if (messages.length)
    throw new HttpBadRequestError(messages.join(","))

  if (!web3Host)
    throw new HttpBadRequestError(CHAIN_NOT_CONFIGURED)

  const dao = new DAO({
    skipWindowAssignment: true,
    web3Host,
    registryAddress
  });

  if (!await dao.start())
    throw new HttpBadRequestError("Failed to connect with chain")

  const registry = await dao.loadRegistry(true);

  if (!registry)
    throw new HttpBadRequestError("invalid registry address");

  const registryGovernor = await registry.governed._governor();

  if (registryGovernor.toLowerCase() !== wallet.toLowerCase())
    return res.status(401).json("User must be registry governor");

  await Database.settings.create({
    key: "networkRegistry",
    value: registryAddress,
    group: "contracts",
    type: "string",
    visibility: "public"
  });


  return {message: "Registry saved"};

}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await post(req, res));
    break;
  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
}


export default AdminRoute(handler);