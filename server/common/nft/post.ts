import { Bounty, ProposalDetail } from "@taikai/dappkit";
import BigNumber from "bignumber.js";
import { NextApiRequest } from "next";
import getConfig from "next/config";
import { Op } from "sequelize";

import models from "db/models";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { formatNumberToNScale } from "helpers/formatNumber";

import DAO from "services/dao-service";
import ipfsService from "services/ipfs-service";

import {
  HttpBadRequestError,
  HttpConflictError,
  HttpNotFoundError,
  HttpServerError,
  HttpUnauthorizedError
} from "server/errors/http-errors";

const { publicRuntimeConfig } = getConfig();

const NftParticipant = (handle, percentage, address, distributedAmount) => ({
  handle,
  percentage,
  address,
  distributedAmount
});

export async function post(req: NextApiRequest) {
  const {
    issueId,
    proposalId,
    context
  } = req.body;

  const ipfsUrl = publicRuntimeConfig?.urls?.ipfs;
  if (!ipfsUrl)
    throw new HttpServerError("Missing ipfs url");

  const mergerAddress = context.user?.address;
  if (!mergerAddress)
    throw new HttpUnauthorizedError("Pull request canceled or not ready");

  const missingParams = [
    [issueId, "issueId"],
    [proposalId, "proposalId"]
  ]
    .filter(([v,]) => !v).map(([,m]) => m as string);

  if (missingParams.length)
    throw new HttpBadRequestError(`Missing params: ${missingParams.join(", ")}`);

  const issue = await models.issue.findOne({
    where: {
      id: +issueId
    },
    include: [
      { association: "network" },
      { association: "chain" }
    ]
  });

  if (!issue)
    throw new HttpNotFoundError("Bounty not found");

  const proposal = await models.mergeProposal.findOne({
    where: {
      id: +proposalId,
      issueId: issue.id
    }
  });

  if (!proposal)
    throw new HttpNotFoundError("Proposal not found");

  const chain = issue.chain;

  const DAOService = new DAO({ 
    skipWindowAssignment: true,
    web3Host: chain?.chainRpc,
  });

  if (!await DAOService.start())
    throw new HttpServerError(`Failed to connect to chainRpc ${chain?.chainRpc} for id ${chain?.chainId}`);

  const { networkAddress } = issue.network;

  if(!await DAOService.loadNetwork(networkAddress))
    throw new HttpServerError(`Failed to load networks on chainRpc ${chain?.chainRpc} for address ${networkAddress}`);

  const network = DAOService.network;
  await network.start();

  const networkBounty = await network.getBounty(issue.contractId) as Bounty;
  if (!networkBounty)
    throw new HttpConflictError("Bounty doesn't exists on chain");

  if(networkBounty.canceled || networkBounty.closed)
    throw new HttpConflictError("Bounty has been closed or canceled on chain");

  const networkProposal = networkBounty.proposals.find(p=> p.id === +proposal.contractId);
  if(!networkProposal)
    throw new HttpConflictError("Proposal doesn't exists on chain");

  if(networkProposal.refusedByBountyOwner || 
      await network.isProposalDisputed(+issue.contractId, +proposal.contractId))
    throw new HttpConflictError("Proposal failed on chain");

  const pullRequest = networkBounty.pullRequests.find(pr=> pr.id === proposal.prId)

  if(pullRequest.canceled || !pullRequest.ready)
    throw new HttpConflictError("Pull request canceled or not ready");

  const [{treasury}, creatorFee, proposerFee] = await Promise.all([ DAOService?.getTreasury(),
                                                                    DAOService?.getMergeCreatorFee(),
                                                                    DAOService?.getProposerFee()
  ]);

  const distributions = calculateDistributedAmounts(treasury,
                                                    creatorFee,
                                                    proposerFee,
                                                    BigNumber(networkBounty.tokenAmount),
                                                    proposal.details);

  const getNftParticipant = async (address, amounts) => {
    const user = await models.user.findOne({ where: { address: { [Op.iLike]: String(address) } } });

    return NftParticipant(user?.githubLogin || '', amounts.percentage, address, amounts.value);
  }

  const merger = await getNftParticipant(mergerAddress, distributions.mergerAmount);

  const participants = await Promise.all(proposal.details.map(async(detail: ProposalDetail, i) => {
    if(!detail.recipient) return;

    return getNftParticipant(detail.recipient, distributions.proposals[i]);
  }));

  const nft = {
    title: `${networkBounty.title}`,
    description: `NFT for bounty ${issue.id} created on network ${issue.network.name}`,
    image: issue.nftImage ? `${ipfsUrl}/${issue.nftImage}`: "",
    properties: {
      price: formatNumberToNScale(networkBounty.tokenAmount),
      merger,
      participants,
      fees: BigNumber(distributions.mergerAmount.value)
                      .plus(BigNumber(distributions.proposerAmount.value)
                      .plus(BigNumber(distributions.treasuryAmount.value))).toString(),
      bountyId: networkBounty.id,
      githubPullRequestId: pullRequest.cid.toString(),
    }
  }

  const { hash } = await ipfsService.add(nft, true);

  if (!hash)
    throw new HttpServerError("Failed to send to ipfs");

  const url = `${ipfsUrl}/${hash}`;

  return url;
}