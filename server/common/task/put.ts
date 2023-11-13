import BigNumber from "bignumber.js";
import { NextApiRequest } from "next";

import models from "db/models";

import { HttpBadRequestError, HttpConflictError, HttpNotFoundError } from "server/errors/http-errors";

import { DatabaseId } from "types/api";

export async function put(req: NextApiRequest): Promise<DatabaseId> {
  const {
    ids: [id, networkName, chainName],
  } = req.query;

  const {
    body,
    tags
  } = req.body;

  const network = await models.network.findOneByNetworkAndChainNames(networkName, chainName);

  if (!network)
    throw new HttpBadRequestError("Invalid network");

  const issue = await models.issue.findOne({
    where: {
      id,
      network_id: network?.id
    }
  });

  if (!issue)
    throw new HttpNotFoundError("Bounty not found");

  const isFundingDraft =
    issue.state === "open" &&
    BigNumber(issue.fundingAmount || 0).gt(BigNumber(issue.fundedAmount || 0));

  if(issue.state === "draft" || isFundingDraft){
    if(body) issue.body = body;
    if(tags) issue.tags = tags;

    await issue.save();

    return issue.id;
  }

  throw new HttpConflictError("Bounty can't be edited");
}