import { ParsedUrlQuery } from "querystring";
import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import paginate, { DEFAULT_ITEMS_PER_PAGE, calculateTotalPages } from "helpers/paginate";

function processLeaderboard(leaderboards) {
  const users: {
    [address: string]: {
      networks: string[],
      chains: string[]
    } 
  } = {}

  leaderboards?.forEach((entry) => {
    const address = entry?.address;
    const networkIcon = entry?.userPayments?.issue?.network?.logoIcon;
    const alreadyExistNetworkIcon = users[address]?.networks?.find(v => v === networkIcon);
    const chainIcon = entry?.userPayments?.issue?.network?.chain?.icon;
    const alreadyExistChainIcon = users[address]?.chains?.find(v => v === chainIcon);

    if (!users[address]) users[address] = { networks: [], chains: [] };

    if (networkIcon && !alreadyExistNetworkIcon) {
      users[address]?.networks?.push(networkIcon);
    }

    if(chainIcon && !alreadyExistChainIcon) {
      users[address]?.chains?.push(chainIcon);
    }
  });

  return users;
}

export default async function get(query: ParsedUrlQuery) {
  const {
    address,
    page,
    search,
    sortBy,
    order,
    networkName
  } = query;

  const whereCondition: WhereOptions = {};

  if (address) whereCondition.address = address;

  const whereInclude = search ? {
    [Op.or]: [
      { address: { [Op.iLike]: `%${search}%` } },
      { githubLogin: { [Op.iLike]: `%${search}%` } },
    ]
  }  : {};
  
  const PAGE = +(page || 1);

  const leaderboard = await models.leaderBoard.findAndCountAll(paginate({
        attributes: {
          exclude: ["id"],
        },
        where: whereCondition,
        subQuery: false,
        include: [
          {
            association: "user",
            attributes: ["githubLogin"],
            required: !!search,
            on: Sequelize.where(Sequelize.fn("lower", Sequelize.col("user.address")),
                                "=",
                                Sequelize.fn("lower", Sequelize.col("leaderboard.address"))),
            where: whereInclude,
          },
          {
            association: "userPayments",
            required: networkName === 'all' || !networkName ? false : true,
            on: Sequelize.where(Sequelize.fn("lower", Sequelize.col("userPayments.address")),
                                "=",
                                Sequelize.fn("lower", Sequelize.col("leaderboard.address"))),
            include: [
              {
                association: "issue",
                required: true,
                include: [
                  {
                    association: "network",
                    required: !!networkName,
                    include: [{ association: "chain", attributes: ["icon"] }],
                    where:
                      networkName === "all"
                        ? {}
                        : networkName
                        ? {
                            name: caseInsensitiveEqual("name",
                                                       networkName?.toString()),
                        }
                        : {},
                  },
                ],
              },
            ],
          },
        ],
  },
      { page: PAGE },
      [[sortBy || "numberNfts", order || "DESC"]])).then((res) => {

        const leaderBoardData = processLeaderboard(res?.rows)
        console.log('processLeaderboard', leaderBoardData)
        
        return res
      })

  return {
    ...leaderboard,
    currentPage: PAGE,
    pages: calculateTotalPages(leaderboard.count, DEFAULT_ITEMS_PER_PAGE)
  };
}