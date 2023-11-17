import BigNumber from "bignumber.js";
import { ParsedUrlQuery } from "querystring";
import {Op, Sequelize, WhereOptions} from "sequelize";

import models from "db/models";

import { orderByProperty } from "helpers/array";
import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { paginateArray } from "helpers/paginate";

export default async function get(query: ParsedUrlQuery) {
  const {
    network,
    chain,
    address,
    page = 1,
    sortBy = "totalVotes",
    order = "DESC"
  } = query;

  const curatorsWhere: WhereOptions = {
    isCurrentlyCurator: true
  };
  const networkWhere: WhereOptions = {};
  const chainWhere: WhereOptions = {};

  if (address)
    curatorsWhere.address = {
      [Op.iLike]: `%${address.toString().toLowerCase()}%`
    };

  if (network)
    networkWhere.name = caseInsensitiveEqual("network.name", network.toString().toLowerCase());

  if (chain)
    chainWhere.name = caseInsensitiveEqual("chainShortName", chain.toString().toLowerCase());

  const curators = await models.curator.findAll({
    attributes: {
      exclude: ["id", "createdAt", "updatedAt"],
    },
    where: curatorsWhere,
    include: [
      {
        association: "disputes",
        on: Sequelize.where(Sequelize.fn("lower", Sequelize.col("curator.address")),
                            "=",
                            Sequelize.fn("lower", Sequelize.col("disputes.address"))),
      },
      {
        association: "network",
        attributes: ["name", "networkAddress"],
        required: !!network || !!chain,
        where: networkWhere,
        include: [
          {
            association: "chain",
            attributes: ["chainId", "chainName", "icon", "color"],
            required: !!chain,
            where: chainWhere
          }
        ]
      }
    ]
  });

  const curatorsGrouped = {};

  for (const curator of curators) {
    const curatorOnResult = curatorsGrouped[curator.address.toLowerCase()];
    const votes = BigNumber(curator.tokensLocked).plus(curator.delegatedToMe);

    curatorsGrouped[curator.address.toLowerCase()] = {
      address: curator.address.toLowerCase(),
      acceptedProposals: (curatorOnResult?.acceptedProposals || 0) + curator.acceptedProposals,
      disputedProposals: (curatorOnResult?.disputedProposals || 0) + curator.disputedProposals,
      disputes: (curatorOnResult?.disputes || 0) + curator.disputes.length,
      totalVotes: votes.plus(curatorOnResult?.totalVotes || 0).toNumber(),
      marketplaces: [... (curatorOnResult?.marketplaces || []), curator.network]
    }
  }

  const sort = ["acceptedProposals", "disputedProposals", "disputes", "totalVotes"].includes(sortBy.toString()) ?
    sortBy.toString() : "totalVotes";

  const result = orderByProperty(Object.values(curatorsGrouped), sort, order.toString());


  const paginatedData = paginateArray(result, 10, +page || 1);

  return {
    count: result.length,
    rows: paginatedData.data,
    pages: paginatedData.pages,
    currentPage: +paginatedData.page
  };
}