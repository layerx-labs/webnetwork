import cache from "memory-cache";
import {NextApiRequest} from "next";
import {ParsedUrlQuery} from "querystring";
import {IncludeOptions} from "sequelize";

import models from "db/models";

import {FIVE_MINUTES_IN_MS, SPAM_TERMS} from "helpers/constants";
import {caseInsensitiveEqual} from "helpers/db/conditionals";
import {loadSettingsFromDb} from "helpers/load-settings-db";

import getTokensPrices from "server/common/check-prices/post";

import {BadRequestErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError} from "../../errors/http-errors";

export default async function get(query: ParsedUrlQuery) {
  const {
    network,
    chain
  } = query;

  if (network && SPAM_TERMS.some(r => r.test(network?.toString())))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters);

  const cacheKey = `/overview/converted-amounts/${network ? network : ""}${chain ? `/${chain}` : ""}`;

  const cachedData = cache.get(cacheKey);

  if (cachedData)
    return cachedData;

  const include: IncludeOptions[] = [
    { association: "transactionalToken" }
  ];

  if (network)
    include.push({
      association: "network",
      attributes: [],
      where: {
        name: caseInsensitiveEqual("name", network.toString())
      }
    });

  if (chain)
    include.push({
      association: "chain",
      attributes: [],
      where: {
        chainShortName: caseInsensitiveEqual("chainShortName", chain.toString())
      }
    });

  const tokens = (await models.tokens.findAll()).map(token => ({
    address: token?.address,
    chainId: token?.chain_id
  }));

  await getTokensPrices({
    body: {
      tokens: tokens
    }
  } as NextApiRequest)
    .catch(() => {});

  const issues = await models.issue.scope("open").findAll({
    include
  });

  const settings = await loadSettingsFromDb();
  const currency = settings?.currency?.defaultFiat || "usd";

  const totalOnTasks = issues.reduce((acc, curr) => acc + curr.amount *
    ((curr.transactionalToken?.last_price_used || {})[currency] || 0), 0);

  cache.put(cacheKey, {
    totalOnTasks
  }, FIVE_MINUTES_IN_MS);

  return {
    totalOnTasks
  }
}