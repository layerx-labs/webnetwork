import { subHours, subMonths, subWeeks, subYears } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { getAssociation } from "helpers/db/models";
import paginate, { calculateTotalPages } from "helpers/paginate";
import { isTrue } from "helpers/string";

export default async function get(query: ParsedUrlQuery) {
  const {
    state,
    issueId,
    chainId,
    visible,
    creator,
    proposer,
    pullRequester,
    networkName,
    repositoryPath,
    transactionalTokenAddress,
    time,
    search,
    page,
    count,
    sortBy,
    order
  } = query;

  const whereCondition: WhereOptions = {};

  // Issue table columns
  whereCondition.state = {
    [Op.notIn]: ["pending", "canceled"]
  };

  if (state) {
    if (state === "funding") {
      whereCondition.fundingAmount = {
        [Op.ne]: "0",
        [Op.ne]: Sequelize.literal('"issue"."fundedAmount"'),
      };
    }
  }

  if (issueId) 
    whereCondition.issueId = issueId;

  if (chainId) 
    whereCondition.chain_id = +chainId;
  
  if (typeof visible !== "undefined") 
    whereCondition.visible = isTrue(visible.toString());

  if (creator) 
    whereCondition.creatorAddress = {
      [Op.iLike]: `%${creator.toString()}%`
    };

  // Time filter
  if (time) {
    const subFn = {
      week: subWeeks,
      month: subMonths,
      year: subYears,
      hour: subHours,
    }

    if (subFn[time.toString()]) 
      whereCondition.createdAt = { 
        [Op.gt]: subFn[time.toString()](+new Date(), 1) 
      };
  }

  if (search) {
    Object.assign(whereCondition, {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ]
    });
  }

  // Associations
  const proposalAssociation = 
    getAssociation( "mergeProposals", 
                    undefined, 
                    !!proposer, 
                    proposer ? { creator: { [Op.iLike]: proposer.toString() } } : {});

  const pullRequestAssociation = 
    getAssociation( "pullRequests", 
                    undefined, 
                    !!pullRequester, 
                    {
                      status: {
                        [Op.not]: "canceled"
                      },
                      ... pullRequester ? { userAddress: { [Op.iLike]: pullRequester.toString() } } : {}
                    });

  const networkAssociation = 
    getAssociation( "network", 
                    ["colors", "name", "networkAddress"], 
                    false, 
                    networkName ? { networkName: caseInsensitiveEqual("network.name", networkName.toString()) } : {});

  const repositoryAssociation = 
    getAssociation( "repository", 
                    ["id", "githubPath"], 
                    false, 
                    repositoryPath ? { 
                      githubPath: caseInsensitiveEqual("repository.githubPath", repositoryPath.toString()) 
                    } : {});

  const transactionalTokenAssociation = 
    getAssociation( "transactionalToken", 
                    ["address", "name", "symbol"], 
                    !!transactionalTokenAddress, 
                    transactionalTokenAddress ? { address: { [Op.iLike]: transactionalTokenAddress.toString() } } : {});

  const RESULTS_LIMIT = count ? +count : undefined;
  const PAGE = +(page || 1);

  const issues = await models.issue.findAndCountAll(paginate({
    logging: console.log,
    where: whereCondition,
    include: [
      proposalAssociation,
      pullRequestAssociation,
      networkAssociation,
      repositoryAssociation,
      transactionalTokenAssociation,
    ]
  }, { page: PAGE }, [[sortBy || "updatedAt", order || "DESC"]], RESULTS_LIMIT));

  return {
    ...issues,
    currentPage: PAGE,
    pages: calculateTotalPages(issues.count, RESULTS_LIMIT)
  };
}