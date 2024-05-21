import BigNumber from "bignumber.js";
import {NextApiRequest} from "next";
import {Op, Sequelize} from "sequelize";

import models from "db/models";

import {getDeveloperAmount} from "helpers/calculateDistributedAmounts";
import {chainFromHeader} from "helpers/chain-from-header";

import { IssueData } from "interfaces/issue-data";

import {HttpBadRequestError, HttpNotFoundError} from "server/errors/http-errors";

export async function get(req: NextApiRequest): Promise<IssueData> {
  const { ids, chainId } = req.query;

  if (!ids?.length)
    throw new HttpBadRequestError("Missing params");

  const [id, networkName, chainName] = ids;

  let network_id: number;

  if ([id, networkName].some(k => k === "undefined" || k === undefined))
    throw new HttpBadRequestError("wrong parameters values");

  if (isNaN(+id) || typeof networkName !== "string")
    throw new HttpBadRequestError("wrong parameters values");

  const include = [
    { association: "developers" },
    { 
      association: "deliverables", 
      where: { prContractId: { [Op.not]: null } }, 
      required: false,
      include: [{ association: "user" }, { association: "comments"}]
    },
    { 
      association: "mergeProposals", 
      where: { contractId: { [Op.not]: null } },
      include: [
        { association: "distributions" }, 
        { association: "disputes" },
        { association: "user" },
      ],
      required: false
    },
    { association: "transactionalToken" },
    { association: "rewardToken" },
    { association: "benefactors" },
    { association: "disputes" },
    { association: "user" },
    {
      association: "network",
      include: [
        {
          association: "chain",
          attributes: [ "chainId", "chainShortName", "closeFeePercentage", "chainName", "icon" ]
        },
        { association: "networkToken" }
      ]
    },
  ];

  const chainHeader = await chainFromHeader(req);

  const chain = chainHeader && !chainName ? chainHeader : await models.chain.findOne({
    where: {
      chainShortName: Sequelize.where(Sequelize.fn("lower", Sequelize.col("chain.chainShortName")), 
                                      chainName?.toString()?.toLowerCase())
    }
  });

  if(networkName && (chainId || chain)) {

    const network = await models.network.findOne({
      where: {
        name: {
          [Op.iLike]: String(networkName).replaceAll(" ", "-")
        },
        chain_id: { [Op.eq]: chainId || chain?.chainId }
      }
    });

    if (!network)
      throw new HttpBadRequestError("Invalid network");

    network_id = network?.id;
  }

  const issue = await models.issue.findOne({
    where: {
      id,
      ... network_id ? { network_id } : {}
    },
    include
  });

  if (!issue)
    throw new HttpNotFoundError("Issue not found");

  const closeFee = issue?.network?.chain?.closeFeePercentage;
  issue.dataValues.developerAmount = getDeveloperAmount(closeFee,
                                                        issue.network.mergeCreatorFeeShare,
                                                        issue.network.proposerFeeShare,
                                                        BigNumber(issue?.amount));

  return issue;
}