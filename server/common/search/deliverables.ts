import { ParsedUrlQuery } from "querystring";
import { Op, WhereOptions } from "sequelize";
import { isAddress } from "web3-utils";

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

  if (taskId && isNaN(+taskId))
    throw new HttpBadRequestError("taskId is not a valid number");

  if (creator && !isAddress(creator?.toString()))
    throw new HttpBadRequestError("creator is not a valid address");

  const deliverableWhere: WhereOptions = {};
  const userWhere: WhereOptions = {};
  const marketplaceWhere: WhereOptions = {};
  const chainWhere: WhereOptions = {};

  if (creator)
    userWhere.address = caseInsensitiveEqual("address", creator.toString());

  if (taskId)
    deliverableWhere.issueId = +taskId;

  if (search) {
    Object.assign(deliverableWhere, {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ]
    });
  }

  if (state) {
    if (state === "canceled")
      deliverableWhere.canceled = true;
    else if (state === "ready")
      deliverableWhere.markedReadyForReview = true;
    else if (state === "accepted")
      deliverableWhere.accepted = true;
    else
      throw new HttpBadRequestError(`Invalid state: ${state}`);
  }

  if (marketplace)
    marketplaceWhere.name = caseInsensitiveEqual("issue->network.name", marketplace.toString());

  if (chain)
    chainWhere.chainShortName = caseInsensitiveEqual("issue->chain.chainShortName", chain.toString());

  const deliverables = await models.deliverable.findAndCountAll(paginate({
    where: deliverableWhere,
    include: [
      getAssociation("user", undefined, !!creator, userWhere),
      getAssociation("comments"),
      getAssociation("issue", undefined, !!taskId || !!marketplace || !!chain, undefined, [
        getAssociation("network", undefined, !!marketplace, marketplaceWhere),
        getAssociation("chain", undefined, !!chain, chainWhere),
        getAssociation("mergeProposals"),
      ]),
    ]
  }, { page: +page }, [[sortBy, order]]));

  return {
    ...deliverables,
    currentPage: +page,
    pages: calculateTotalPages(deliverables.count),
  };
}