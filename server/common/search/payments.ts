import { ParsedUrlQuery } from "querystring";
import { Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { getAssociation } from "helpers/db/models";
import paginate, { calculateTotalPages } from "helpers/paginate";

export default async function get(query: ParsedUrlQuery) {
  const {
    wallet,
    networkName,
    networkChain,
    page = 1,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  const userWhere: WhereOptions = {};
  const marketplaceWhere: WhereOptions = {};
  const chainWhere: WhereOptions = {};

  if (wallet)
    userWhere.address = caseInsensitiveEqual("user.address", wallet.toString());

  if (networkName)
    marketplaceWhere.name = caseInsensitiveEqual("issue->network.name", networkName.toString());

  if (networkChain)
    chainWhere.chainShortName = caseInsensitiveEqual("issue->chain.chainShortName", networkChain.toString());

  const payments = await models.userPayments.findAndCountAll(paginate({
    include: [
      getAssociation( "user",
                      undefined,
                      !!wallet,
                      userWhere,
                      undefined,
                      Sequelize.where(Sequelize.fn("lower", Sequelize.col("user.address")),
                                      "=",
                                      Sequelize.fn("lower", Sequelize.col("userPayments.address")))),
      getAssociation("issue", undefined, !!networkName || !!networkChain, undefined, [
        getAssociation("network", undefined, !!networkName, marketplaceWhere),
        getAssociation("chain", undefined, !!networkChain, chainWhere),
      ]),
    ]
  }, { page: +page }, [[sortBy, order]]));

  return {
    ...payments,
    currentPage: +page,
    pages: calculateTotalPages(payments.count),
  };
}