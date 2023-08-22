import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { chainFromHeader } from "helpers/chain-from-header";

import { withProtected } from "middleware";
import { WithValidChainId } from "middleware/with-valid-chain-id";

import { add } from "services/ipfs-service";

async function post(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    body,
    deliverableType,
    origin,
    networkName,
    tags,
    tierList,
    isKyc,
    amount,
    context
  } = req.body;

  const chain = await chainFromHeader(req);

  if (!chain)
    return res.status(403).json("Chain not provided");

  const network = await models.network.findOne({
    where: {
      name: {
        [Op.iLike]: String(networkName).replaceAll(" ", "-")
      },
      chain_id: { [Op.eq]: +chain.chainId }
    }
  });

  if (!network || network?.isClosed) return res.status(404).json("Invalid network");

  // TODO: BEPRO-1841 fetch banned domains list from database
  const bannedDomains = [];

  const isOriginBanned = origin ? 
    bannedDomains.some(banned => origin.toLowerCase().includes(banned.toLowerCase())) : false;

  if (isOriginBanned)
    return res.status(400).json("Banned origin provided");

  const user = await models.user.findByAddress(context.token.address);

  if (!user)
    return res.status(401).json("Invalid user");

  const issue = {
    type: deliverableType,
    origin,
    amount,
    state: "pending",
    title,
    body: body,
    network_id: network.id,
    tags,
    chain_id: +chain.chainId,
    isKyc: !!isKyc,
    kycTierList: tierList?.map(Number).filter(id=> !Number.isNaN(id)) || [],
    userId: user.id
  };

  const bountyJson = {
    name: issue.title,
    properties: {
      type: deliverableType,
      origin: origin,
      chainId: issue.chain_id,
      network: {
        name: network.name,
        address: network.networkAddress,
      },
      price: issue.amount,
      tags: issue.tags,
      kycNeeded: issue.isKyc
    }
  };

  const { hash } = await add(bountyJson, true);

  const savedIssue = await models.issue.create({
    ...issue,
    ipfsUrl: hash
  });

  return res.status(200).json(savedIssue);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "post":
    await post(req, res);
    break;

  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
}

// TODO: add withUser middleware after https://github.com/layerx-labs/webnetwork/pull/139 merge
export default withProtected(WithValidChainId(handler));
