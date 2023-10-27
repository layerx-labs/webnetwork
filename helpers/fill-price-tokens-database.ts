import getConfig from "next/config";

import models from "db/models";

import { COINGECKO_API } from "services/coingecko";

const {publicRuntimeConfig: {
    currency
  }} = getConfig();

export default async function FillPriceTokensDatabase() {
  const currencys = currency || "usd";

  const coins = await COINGECKO_API.get(`/coins/list?include_platform=false`).then((value) => value.data);

  const tokens = await models.tokens.findAll({});

  const coinsExistInDb = coins.filter((token) =>
    [...tokens.map(({ symbol }) => symbol)].includes(token.symbol));

  const ids = coinsExistInDb.map(({ id }) => id).join();

  const price = await COINGECKO_API.get(`/simple/price?ids=${ids}&vs_currencies=${currencys}`);

  if (!price?.data) {
    throw new Error("Error to get prices coingecko");
  }

  const pricesBySymbol = coinsExistInDb.map(({ symbol, id }) =>
      ({ [currencys]: price?.data?.[id]?.[currencys] }[symbol]));

  for (const token of tokens) {
    if (pricesBySymbol[token.symbol]) {
      token.last_price_used = {
        ...pricesBySymbol[token.symbol],
        updatedAt: new Date(),
      };
      await token.save();
    }
  }

  return tokens
}
