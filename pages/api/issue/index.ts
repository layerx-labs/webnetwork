import {NextApiRequest, NextApiResponse} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {chainFromHeader} from "helpers/chain-from-header";

import { withProtected } from "middleware";
import {WithValidChainId} from "middleware/with-valid-chain-id";

async function post(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    repositoryId,
    networkName,
    tags,
    tierList,
    isKyc,
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

  const repository = await models.repositories.findOne({
    where: { id: repositoryId, network_id: network.id }
  });

  if (!repository) return res.status(404).json("Repository not found");

  const issue = await models.issue.create({
    repository_id: repository.id,
    creatorAddress: '',
    creatorGithub: '',
    amount: 0,
    branch: '',
    state: "pending",
    title: '',
    body: body,
    network_id: network.id,
    tags,
    chain_id: +chain.chainId,
    isKyc: !!isKyc,
    kycTierList: tierList?.map(Number).filter(id=> !Number.isNaN(id)) || [],
  });

  return res.status(200).json(`${repository.id}/${issue.id}`);
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

export default withProtected(WithValidChainId(handler));
