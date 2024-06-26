import { NextApiRequest } from "next";
import { Op } from "sequelize";

import Database from "db/models";

import { chainFromHeader } from "helpers/chain-from-header";
import { STATIC_URL_PATHS } from "helpers/constants";
import { handleCreateSettlerToken, handlefindOrCreateTokens } from "helpers/handleNetworkTokens";
import { verifySiweSignature } from "helpers/siwe";
import { lowerCaseCompare } from "helpers/string";

import DAO from "services/dao-service";
import IpfsStorage from "services/ipfs-service";
import { Logger } from "services/logging";

import { HttpBadRequestError, HttpConflictError, HttpForbiddenError, HttpServerError } from "server/errors/http-errors";

export async function post(req: NextApiRequest) {
  const {
    name: _name,
    colors,
    creator,
    fullLogo,
    logoIcon,
    description,
    tokens,
    networkAddress
  } = req.body;

  if (!_name)
    throw new HttpBadRequestError("Wrong payload");

  const name = _name.replaceAll(" ", "-").toLowerCase();
  
  const chain = await chainFromHeader(req);

  const signedAddress = await verifySiweSignature( req?.body?.context?.siweMessage,
                                                   req.body?.context?.token?.signature,
                                                   req.body?.context?.token?.nonce);

  const validateSignature = assumedOwner =>  lowerCaseCompare(signedAddress, assumedOwner);

  // Reserved names
  const invalidName = value => /bepro|taikai/gi.test(value) || STATIC_URL_PATHS.includes(value?.toLowerCase())

  if(invalidName(name)) 
    throw new HttpForbiddenError("Invalid network name");

  if (!validateSignature(creator))
    throw new HttpForbiddenError("Invalid signature");

  const hasNetwork = await Database.network.findOne({
    where: {
      creatorAddress: creator,
      chain_id: +chain?.chainId,
      isClosed: false,
    }
  });

  if (hasNetwork) 
    throw new HttpConflictError("Already exists a network created for this wallet");

  const sameNameOnOtherChain = await Database.network.findOne({
    where: {
      isClosed: false,
      chain_id: {
        [Op.not]: +chain?.chainId
      },
      name: {
        [Op.iLike]: name
      }
    }
  });

  if (sameNameOnOtherChain && !validateSignature(sameNameOnOtherChain.creatorAddress))
    throw new HttpForbiddenError("Network name owned by other wallet");

  // Contract Validations
  const DAOService = new DAO({ 
    skipWindowAssignment: true,
    web3Host: chain.privateChainRpc,
    registryAddress: chain.registryAddress,
  });

  if (!await DAOService.start())
    throw new HttpServerError("Failed to connect with chain");
  
  if (!await DAOService.loadRegistry())
    throw new HttpServerError("Failed to load registry");

  if (await DAOService.hasNetworkRegistered(creator))
    throw new HttpConflictError("Already exists a network registered for this wallet");
  
  if (tokens?.settler && tokens?.settlerTokenMinAmount) {
    await handleCreateSettlerToken( tokens?.settler,
                                    tokens?.settlerTokenMinAmount,
                                    chain.privateChainRpc,
                                    +chain?.chainId);
  }

  // Uploading logos to IPFS
  let fullLogoHash = null
  let logoIconHash = null

  try {
    const [full, logo] = await Promise.all([
      IpfsStorage.add(fullLogo, true, undefined, "svg"),
      IpfsStorage.add(logoIcon, true, undefined, "svg")
    ])

    if (full?.hash) fullLogoHash = full.hash;
    if (logo?.hash) logoIconHash = logo.hash;

  } catch (error) {
    Logger.error(error, 'Failed to store ipfs');
  }

  const network = await Database.network.create({
    creatorAddress: creator,
    name: name,
    description,
    colors: colors,
    logoIcon: logoIconHash,
    fullLogo: fullLogoHash,
    networkAddress,
    chain_id: +chain?.chainId
  });

  if(tokens?.allowedTransactions?.length > 0) {
    for (const token of tokens.allowedTransactions) {
      await handlefindOrCreateTokens(token.id, network.id, 'transactional');
    }
  }

  if(tokens?.allowedRewards?.length > 0){
    for (const token of tokens.allowedRewards) {
      await handlefindOrCreateTokens(token.id, network.id, 'reward');
    }
  }

  return network.id;
}