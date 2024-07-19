import BigNumber from "bignumber.js";
import { subHours, subMonths, subWeeks, subYears } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { getDeveloperAmount } from "helpers/calculateDistributedAmounts";
import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { getAssociation } from "helpers/db/models";
import paginate, {calculateTotalPages} from "helpers/paginate";

import { BadRequestErrors } from "interfaces/enums/Errors";

import { HttpBadRequestError } from "server/errors/http-errors";

export default async function searchTasksWon(query: ParsedUrlQuery) {
  const {
    chainId,
    chain,
    networkChain,
    network,
    networkName,
    time,
    search,
    page,
    count,
    sortBy,
    order,
    receiver
  } = query;

  if (!receiver)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  const whereCondition: WhereOptions = {};

  whereCondition.state = "closed";

  if (chainId) 
    whereCondition.chain_id = +chainId;

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
                    true,
                    {
                      contractId: { 
                        [Op.eq]: Sequelize.literal(`cast(issue."merged" as integer)`)
                      },
                    },
                    [
                      {
                        association: "distributions",
                        required: true,
                        where: {
                          recipient: caseInsensitiveEqual("recipient", receiver.toString().toLowerCase())
                        }
                      }
                    ]);

  const networkAssociation = 
    getAssociation( "network", 
                    [
                      "colors",
                      "name",
                      "networkAddress",
                      "disputableTime",
                      "logoIcon",
                      "fullLogo",
                      "mergeCreatorFeeShare",
                      "proposerFeeShare"
                    ], 
                    true, 
                    (networkName || network) ? {
                      name: caseInsensitiveEqual("network.name", (networkName || network).toString())
                    } : {},
                    [getAssociation("chain", 
                                    [
                                      "chainId", "chainName", "chainShortName", "color", "closeFeePercentage", 
                                      "icon", "blockScanner"
                                    ], 
                                    true, 
                                    networkChain || chain ? {
                                      chainShortName: { [Op.iLike]: (networkChain || chain).toString()}
                                    } : {})]);

  const transactionalTokenAssociation = 
    getAssociation( "transactionalToken", 
                  ["address", "name", "symbol"]);

  const paymentAssociation = 
    getAssociation( "payments", 
                    ["transactionHash"],
                    true);

  const COLS_TO_CAST = ["amount", "fundingAmount"];
  const RESULTS_LIMIT = count ? +count : undefined;
  const PAGE = +(page || 1);
  const sort = [];
  
  if (sortBy) {
    const columns = sortBy
      .toString()
      .replaceAll(",", ",+,")
      .split(",")
      .map(column => {
        if (column === "+") return Sequelize.literal("+");
        if (COLS_TO_CAST.includes(column)) return Sequelize.cast(Sequelize.col(column), "DECIMAL");

        return column;
      });

    sort.push(...columns);
  } else
    sort.push(Sequelize
      .literal(`case when "issue"."state" in ('ready', 'proposal') then 'open' else "issue"."state" end`));

  const issues = await models.issue.findAndCountAll(paginate({
    where: whereCondition,
    include: [
      networkAssociation,
      proposalAssociation,
      transactionalTokenAssociation,
      paymentAssociation,
    ]
  }, { page: PAGE }, [[...sort, order || "DESC"], ["createdAt", "DESC"]], RESULTS_LIMIT))
  .then(result => {
    const rows = result.rows.map(issue => {
      const closeFee = issue.network.chain.closeFeePercentage;
      issue.dataValues.developerAmount = getDeveloperAmount(closeFee,
                                                            issue.network.mergeCreatorFeeShare,
                                                            issue.network.proposerFeeShare,
                                                            BigNumber(issue?.amount));

      // nextjs is simply dumb
      return JSON.parse(JSON.stringify(issue.toJSON()));
    });

    return {
      ...result,
      rows
    }
  });

  return {
    ...issues,
    currentPage: PAGE,
    pages: calculateTotalPages(issues.count, RESULTS_LIMIT),
  };
}