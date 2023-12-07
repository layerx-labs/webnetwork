import { ParsedUrlQuery } from "querystring";
import {Op, Sequelize, WhereOptions} from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual, caseLiteral } from "helpers/db/conditionals";

export default async function get(query: ParsedUrlQuery) {
  const {
    network: name,
    address,
    chain,
    chainId,
  } = query;

  if (!name && !address)
    throw new Error("Missing parameters");

  const networkWhere: WhereOptions = {};

  if (name)
    networkWhere.name = caseInsensitiveEqual("network.name", name.toString());

  if (address)
    networkWhere.networkAddress = caseInsensitiveEqual("network.networkAddress", address.toString());

  const chainWhere: WhereOptions = {};

  if (chain)
    chainWhere.chainShortName = caseInsensitiveEqual("chain.chainShortName", chain.toString());

  if (chainId)
    chainWhere.chainId = +chainId;

  const networks = await models.network.findAll({
    where: networkWhere,
    include: [
      {
        attributes: ["chainId", "chainShortName"],
        association: "chain",
        required: true,
        where: chainWhere,
      }
    ],
  });

  if (!networks?.length)
    throw new Error("Network not found");

  const { networksIds, tokensIds, networksAddresses } = networks.reduce((acc, curr) => ({
    networksIds: [...acc.networksIds, curr.id],
    tokensIds: [...acc.tokensIds, curr.network_token_id],
    networksAddresses: [...acc.networksAddresses, curr.networkAddress],
  }), { networksIds: [], tokensIds: [], networksAddresses: [] });

  const [bounties, curators, networkTokenOnClosedBounties, members] = await Promise.all([
    models.issue.findAll({
      raw: true,
      attributes: [
        "state",
        [Sequelize.fn("COUNT", Sequelize.col("issue.id")), "total"]
      ],
      group: ["issue.state"],
      where: {
        network_id: {
          [Op.in]: networksIds
        },
        visible: true
      }
    })
      .then(values => Object.fromEntries(values.map(({ state, total }) => [state, +total]))),
    models.curator.findOne({
      raw: true,
      attributes: [
        [Sequelize.fn("SUM", caseLiteral(`"curator"."isCurrentlyCurator"`, 1, 0)), "total"],
        [
          Sequelize.fn("SUM", Sequelize.literal(`CAST("curator"."tokensLocked" as FLOAT)
            + CAST("curator"."delegatedToMe" as FLOAT)`)),
          "tokensLocked"
        ],
      ],
      where: {
        networkId: {
          [Op.in]: networksIds
        }
      }
    })
      .then(curators => ({ ...curators, total: +curators.total })),
    models.issue.findOne({
      raw: true,
      attributes: [
        [Sequelize.fn("SUM", Sequelize.literal(`CAST("issue"."amount" as FLOAT)`)), "total"]
      ],
      where: {
        transactionalTokenId: {
          [Op.in]: tokensIds
        },
        network_id: {
          [Op.in]: networksIds
        },
        state: "closed"
      }
    }),
    models.user.count()
  ]);

  return {
    name: networks[0].name,
    networkAddress: networksAddresses,
    bounties,
    curators,
    networkTokenOnClosedBounties: networkTokenOnClosedBounties.total || 0,
    members,
  };
}