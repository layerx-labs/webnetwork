import BigNumber from "bignumber.js";
import {ParsedUrlQuery} from "querystring";
import {Sequelize} from "sequelize";

import models from "db/models";

import {getDeveloperAmount} from "helpers/calculateDistributedAmounts";
import {caseInsensitiveEqual} from "helpers/db/conditionals";
import {getAssociation} from "helpers/db/models";

import {HttpNotFoundError} from "server/errors/http-errors";

export default async function get(query: ParsedUrlQuery) {
  const {
    proposalId,
    network,
    chain,
  } = query;

  if (!proposalId || !network)
    throw new HttpNotFoundError("Missing parameters");

  const proposal = await models.mergeProposal.findOne({
    where: {
      id: proposalId
    },
    include: [
      getAssociation("disputes"),
      getAssociation("user"),
      getAssociation("distributions", ["recipient", "percentage"], true, undefined, [
        getAssociation( "user",
                        ["handle", "avatar"],
                        false,
                        undefined,
                        undefined, 
                        Sequelize.where(Sequelize.fn("lower", Sequelize.col("distributions.user.address")),
                                        "=",
                                        Sequelize.fn("lower", Sequelize.col("distributions.recipient"))))
      ]),
      getAssociation("deliverable", undefined, false, undefined, [getAssociation("user")]),
      getAssociation("issue", undefined, true, undefined, [
        getAssociation("transactionalToken", ["name", "symbol", "address", "chain_id"]),
        getAssociation("user", ["address", "handle"]),
      ]),
      getAssociation("network", undefined, true, {
        name: caseInsensitiveEqual("network.name", network?.toString())
      }, [
        getAssociation("chain", ["chainId", "chainShortName", "icon", "closeFeePercentage"], true, chain ? {
          chainShortName: caseInsensitiveEqual("network.chain.chainShortName", chain?.toString())
        } : {})
      ]),
    ]
  });

  if (!proposal)
    throw new HttpNotFoundError("Proposal not found");

  const closeFee = proposal.network.chain.closeFeePercentage;
  const mergeCreatorFeeShare = proposal.network.mergeCreatorFeeShare;
  const proposerFeeShare = proposal.network.proposerFeeShare;
  proposal.dataValues.issue.dataValues.developerAmount = getDeveloperAmount(closeFee,
                                                                            mergeCreatorFeeShare,
                                                                            proposerFeeShare,
                                                                            BigNumber(proposal.issue.amount));

  return proposal;
}