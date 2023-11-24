import BigNumber from "bignumber.js";
import { ParsedUrlQuery } from "querystring";
import {Op, Sequelize, WhereOptions} from "sequelize";

import models from "db/models";

import { orderByProperty } from "helpers/array";
import { caseInsensitiveEqual } from "helpers/db/conditionals";
import paginate, {DEFAULT_ITEMS_PER_PAGE, paginateArray} from "helpers/paginate";

import {castToInt} from "server/utils/sequelize";

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

  const columnToSort = [
    "acceptedProposals",
    "disputedProposals",
    "disputes",
    "totalVotes"
  ].includes(sortBy.toString()) ? sortBy.toString() : "totalVotes";
  const orderToSort =
    ["asc", "desc"].includes(order?.toString()?.toLowerCase()) ? order?.toString()?.toLowerCase() : "desc";

  const columns = {
    acceptedProposals: castToInt(Sequelize.fn("SUM", Sequelize.col("acceptedProposals"))),
    disputedProposals: castToInt(Sequelize.fn("SUM", Sequelize.col("disputedProposals"))),
    disputes: castToInt(Sequelize.literal('(select count(*) from "disputes" d where d.address = "curator".address)')),
    totalVotes: Sequelize.literal(`sum(cast("tokensLocked" as FLOAT) + cast("delegatedToMe" as FLOAT))`),
  };

  const curators = await models.curator.findAndCountAll(paginate({
    attributes: [
      "curator.address",
      [columns["acceptedProposals"], "acceptedProposals"],
      [columns["disputedProposals"], "disputedProposals"],
      [columns["disputes"], "disputes"],
      [columns["totalVotes"], "totalVotes"],
    ],
    raw: true,
    where: curatorsWhere,
    group: ["curator.address"],
    include: [
      {
        association: "network",
        attributes: [],
        required: !!network || !!chain,
        where: networkWhere,
        include: [
          {
            association: "chain",
            attributes: [],
            required: !!chain,
            where: chainWhere
          }
        ]
      }
    ]
  }, { page: +page }, [[columns[columnToSort], orderToSort]]));

  const curatorsWithNetworks = await Promise.all(curators.rows.map(async curator => ({
    ...curator,
    marketplaces: await models.network.findAll({
      attributes: ["name", "networkAddress"],
      include: [
        {
          association: "curators",
          attributes: [],
          where: {
            ...networkWhere,
            address: curator.address
          }
        },
        {
          association: "chain",
          attributes: ["chainId", "chainName", "icon", "color"],
          where: chainWhere
        }
      ]
    })
  })));

  const totalCurators = await models.curator.count({
    where: {
      isCurrentlyCurator: true,
    },
    include: [
      {
        association: "network",
        attributes: [],
        required: !!network || !!chain,
        where: networkWhere,
        include: [
          {
            association: "chain",
            attributes: [],
            required: !!chain,
            where: chainWhere
          }
        ]
      }
    ]
  });

  return {
    count: curators.count.length,
    rows: curatorsWithNetworks,
    pages: Math.ceil(curators.count.length / DEFAULT_ITEMS_PER_PAGE),
    totalCurators,
    currentPage: +page
  };
}