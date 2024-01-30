import { endOfDay, isAfter, parseISO, startOfDay } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import paginate, { calculateTotalPages } from "helpers/paginate";

import { HttpBadRequestError } from "server/errors/http-errors";

export default async function get(query: ParsedUrlQuery) {
  const {
    wallet,
    startDate,
    endDate,
    networkName,
    networkChain,
    groupBy,
    page,
    sortBy,
    order,
  } = query;

  if (!wallet)
    throw new HttpBadRequestError("Missing parameters: wallet");

  const networkWhere: WhereOptions = networkName ? {
    name: caseInsensitiveEqual("issue.network.name", networkName.toString())
  } : {};

  const chainWhere: WhereOptions = networkChain ? {
    chainShortName: caseInsensitiveEqual("issue.network.chain.chainShortName", networkChain.toString())
  } : {};

  const timeFilter: WhereOptions = {};

  if (startDate && endDate) {
    const initialDate = parseISO(startDate.toString())
    const finalDate = parseISO(endDate.toString())
  
    if (isAfter(initialDate, finalDate))
      throw new HttpBadRequestError("Invalid time interval");

    timeFilter.createdAt = {
      [Op.between]: [startOfDay(initialDate), endOfDay(finalDate)]
    };
  } else if (endDate) {
    timeFilter.createdAt = {
      [Op.lte]: parseISO(endDate?.toString())
    };
  }

  const sort = [];
  const PAGE = +(page || 1);
  const COLS_TO_CAST = ["ammount"];

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
    sort.push("createdAt");

  const payments = await models.userPayments.findAndCountAll(paginate({
    include: [
      {
        association: "issue",
        attributes: ["id", "title", "amount", "fundingAmount", "rewardAmount"],
        required: true,
        include: [
          {
            association: "transactionalToken",
            attributes: ["address", "name", "symbol", "chain_id"]
          },
          {
            association: "network",
            attributes: ["id", "name", "colors", "logoIcon", "fullLogo", "networkAddress"],
            required: !!networkName || !!networkChain,
            where: networkWhere,
            include: [
              {
                association: "chain",
                attributes: ["chainShortName"],
                required: !!networkChain,
                where: chainWhere
              }
            ],
          },
        ],
      },
    ],
    where: {
      address: {
        [Op.iLike]: wallet
      },
      transactionHash: {
        [Op.not]: null
      },
      ...timeFilter
    }
  }, { page: PAGE }, [[...sort, order || "DESC"]]));

  if (payments.count && groupBy === "network") {
    return payments.rows
      .map(p => p.get({ plain: true }))
      .reduce((acc, cur) => {
        const curNetworkIndex = acc.findIndex(n => n.id === cur.issue.network.id);
        
        const newAcc = [...acc];
        const withoutNetwork = {
          ...cur,
          issue: {
            ...cur.issue,
            network: undefined,
          }
        };
        
        if (curNetworkIndex > -1)
          newAcc[curNetworkIndex].payments.push(withoutNetwork);
        else
          newAcc.push({ ...cur.issue.network, payments: [withoutNetwork] });
          
        return newAcc;
      }, []);
  }

  return {
    ...payments,
    currentPage: PAGE,
    pages: calculateTotalPages(payments.count)
  };
}