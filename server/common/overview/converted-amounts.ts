import cache from "memory-cache";
import {NextApiRequest} from "next";
import {ParsedUrlQuery} from "querystring";
import {IncludeOptions} from "sequelize";

import models from "db/models";

import {FIVE_MINUTES_IN_MS} from "helpers/constants";
import {caseInsensitiveEqual} from "helpers/db/conditionals";
import {loadSettingsFromDb} from "helpers/load-settings-db";

import updateTokensPrice from "server/common/check-prices/post";

import isSpamValue from "../../../helpers/is-spam-value";
import {BadRequestErrors} from "../../../interfaces/enums/Errors";
import {HttpBadRequestError, HttpNotFoundError} from "../../errors/http-errors";

export default async function get(query: ParsedUrlQuery) {
  const {
    network,
    chain
  } = query;

  if (network && isSpamValue(network))
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

  const tokens = (await models.tokens.findAll()).map(token => ({address: token?.address, chainId: token?.chain_id}));

  if (!tokens.length)
    throw new HttpNotFoundError("not found");

  const issues = await models.issue.scope("open").findAll({include});

  if (!issues.length)
    throw new HttpNotFoundError("not found");

  await updateTokensPrice({body: {tokens: tokens}} as NextApiRequest).catch(() => {});
  const settings = await loadSettingsFromDb();
  const currency = settings?.currency?.defaultFiat || "usd";

  const totalOnTasks =
    issues.reduce((acc, curr) =>
      acc + curr.amount * ((curr.transactionalToken?.last_price_used || {})[currency] || 0), 0);

  cache.put(cacheKey, {
    totalOnTasks
  }, FIVE_MINUTES_IN_MS);

  return {
    totalOnTasks
  }
}