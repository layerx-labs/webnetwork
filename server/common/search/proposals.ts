import { ParsedUrlQuery } from "querystring";
import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { getAssociation } from "helpers/db/models";
import paginate, { calculateTotalPages } from "helpers/paginate";

import { HttpBadRequestError } from "server/errors/http-errors";

export default async function get(query: ParsedUrlQuery) {
  const {
    taskId,
    creator,
    search,
    state,
    networkName: marketplace,
    networkChain: chain,
    page = 1,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  const proposalWhere: WhereOptions = {};
  const taskWhere: WhereOptions = {};
  const userWhere: WhereOptions = {};
  const marketplaceWhere: WhereOptions = {};
  const chainWhere: WhereOptions = {};

  if (creator)
    userWhere.address = caseInsensitiveEqual("address", creator.toString());

  if (taskId)
    proposalWhere.issueId = +taskId;

  if (search) {
    Object.assign(taskWhere, {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ]
    });
  }

  if (state) {
    if (state === "refused")
      proposalWhere.refusedByBountyOwner = true;
    else if (state === "disputed")
      proposalWhere.isDisputed = true;
    else
      throw new HttpBadRequestError(`Invalid state: ${state}`);
  }

  if (marketplace)
    marketplaceWhere.name = caseInsensitiveEqual("network.name", marketplace.toString());

  if (chain)
    chainWhere.chainShortName = caseInsensitiveEqual("network->chain.chainShortName", chain.toString());

  const proposalUserOn = Sequelize.where(Sequelize.fn("lower", Sequelize.col("mergeProposal.creator")),
                                         "=",
                                         Sequelize.fn("lower", Sequelize.col("user.address")));

  const proposals = await models.mergeProposal.findAndCountAll(paginate({
    where: proposalWhere,
    include: [
      getAssociation("user", undefined, !!creator, userWhere, undefined, proposalUserOn),
      getAssociation("issue", undefined, !!taskId || !!marketplace || !!chain, taskWhere),
      getAssociation("deliverable", undefined, undefined, undefined, [
        getAssociation("user")
      ]),
      getAssociation("network", undefined, !!marketplace || !!chain, marketplaceWhere, [
        getAssociation("chain", undefined, !!chain, chainWhere)
      ]),
    ]
  }, { page: +page }, [[sortBy, order]]));

  return {
    ...proposals,
    currentPage: +page,
    pages: calculateTotalPages(proposals.count),
  };
}