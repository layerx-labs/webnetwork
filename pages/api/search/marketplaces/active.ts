import BigNumber from "bignumber.js";
import {NextApiRequest, NextApiResponse} from "next";
import {Op, WhereOptions} from "sequelize";
import {isAddress} from "web3-utils";

import models from "db/models";

import {paginateArray} from "helpers/paginate";

import {withCORS} from "middleware";

import {HttpBadRequestError} from "server/errors/http-errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const whereCondition: WhereOptions = {};

  const {
    name,
    creatorAddress,
    quantity = 3,
    page = 1,
    isClosed
  } = req.query || {};

  if (creatorAddress && !isAddress(creatorAddress?.toString()))
    throw new HttpBadRequestError("provided creator address is not an address")

  if (creatorAddress)
    whereCondition.creatorAddress = { [Op.iLike]: String(creatorAddress) };
  
  if (isClosed)
    whereCondition.isClosed = isClosed === "true";

  if (name)
    whereCondition.name = name;
    
  const include = [
    { 
      association: "issues",
      attributes: ["id"],
      required: false,
      where: { 
        state: { [Op.notIn]: ["pending", "canceled"] },
        visible: true
      }
    },
    { 
      association: "curators",
      required: false,
      attributes: ["id", "tokensLocked", "delegatedToMe"]
    },
    { 
      association: "chain",
      attributes: ["chainId", "chainName", "chainShortName", "icon", "color"]
    }
  ];

  const networks = await models.network.findAll({
    attributes: ["name", "colors", "logoIcon", "fullLogo", "networkAddress"],
    where: whereCondition,
    include,
    nest: true,
    order: [["name", "ASC"], ["id", "ASC"]]
  });

  const groupBy = name ? "networkAddress" : "name";
  const result = {};

  for (const network of networks) {
    const tokensLocked = network?.curators?.reduce((ac, cv) => BigNumber(ac).plus(cv?.tokensLocked || 0), BigNumber(0));
    const delegatedLocked = 
      network?.curators?.reduce((ac, cv) => BigNumber(ac).plus(cv?.delegatedToMe || 0), BigNumber(0));
    
    const networkOnResult = result[network[groupBy]?.toLowerCase()];

    result[network[groupBy]?.toLowerCase()] = {
      name: (networkOnResult || network)?.name,
      fullLogo: (networkOnResult || network)?.fullLogo,
      logoIcon: (networkOnResult || network)?.logoIcon,
      totalValueLock: 
        BigNumber(networkOnResult?.totalValueLock || 0).plus(delegatedLocked).plus(tokensLocked).toFixed(),
      totalIssues: (networkOnResult?.totalIssues || 0 ) + network?.issues?.length || 0,
      chains: [...(networkOnResult?.chains || []), network?.chain]
    }
  }

  const compare = (networkOne, networkTwo) => (networkOne?.totalIssues >= networkTwo?.totalIssues ? -1 : 0 );
  const networksResult = Object.values(result);
  
  const paginatedData = paginateArray(networksResult.sort(compare), quantity, page);

  return res.status(200).json({
          count: networksResult.length,
          rows: paginatedData.data,
          pages: paginatedData.pages,
          currentPage: +paginatedData.page
  });
}

async function SearchNetworks(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    await get(req, res);
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(SearchNetworks);
