import getConfig from "next/config";

import models from "db/models";

import { COINGECKO_API } from "services/coingecko";

import { HttpConflictError, HttpServerError } from "server/errors/http-errors";

const {publicRuntimeConfig: {
    currency
  }} = getConfig();

async function updateToken (token, price: object, currencys: string, updatedAt: Date) {
  token.last_price_used = {
      [currencys]: price,
      updatedAt,
  };
  await token.save();
}

export default async function FillPriceTokensDatabase() {
  const currencys = currency || "usd";

  const coins = await COINGECKO_API.get(`/coins/list?include_platform=true`).then((value) => value.data);

  const tokens = await models.tokens.findAll({});

  const dbSymbols = [...new Set(tokens.map(({ symbol }) => symbol?.toLowerCase()))]
  const coinsBySymbolOnDb = coins.filter((token) => dbSymbols.includes(token.symbol?.toLowerCase()));

  const coinsExistInDb = coinsBySymbolOnDb.filter((coin) => {
    const uniqueSymbol = coinsBySymbolOnDb.filter((v) => v.symbol === coin.symbol).length === 1;
    const platforms: { [key: string]: string } = coin.platforms;
  
    if (!uniqueSymbol) {
      for (const [, value] of Object.entries(platforms)) {
        if (tokens.find((t) => t?.address?.toLowerCase() === value?.toLowerCase())) {
          return true;
        }
      }
    }
  
    return uniqueSymbol;
  });

  if(!coinsExistInDb?.length) throw new HttpConflictError("coingecko did not find the id for the tokens");

  const ids = coinsExistInDb.map(({ id }) => id).join();

  const price = await COINGECKO_API.get(`/simple/price?ids=${ids}&vs_currencies=${currencys}`);

  if (!price?.data) {
    throw new HttpServerError("Error to get prices coingecko");
  }

  const pricesBySymbol = coinsExistInDb.reduce((res, { symbol, id }) => {
    res[symbol.toLowerCase()] = { [currencys]: price?.data?.[id]?.[currencys] };
    return res;
  }, {});

  for (const token of tokens) {
    const lowercaseSymbol = token.symbol.toLowerCase();
    const coinsByTokenSymbol = coinsExistInDb.filter(v => v.symbol.toLowerCase() === token.symbol.toLowerCase())

    if (coinsByTokenSymbol.length === 1) {
      await updateToken(token, pricesBySymbol[lowercaseSymbol][currencys], currencys, new Date());
    }

    if(coinsByTokenSymbol.length > 1) {
      for(const ctoken of coinsExistInDb){
        const platforms: { [key: string]: string } = ctoken.platforms
        for(const [, value] of Object.entries(platforms)){
          if(value.toLowerCase() === token.address.toLowerCase()){
            await updateToken(token, price?.data?.[ctoken.id]?.[currencys], currencys, new Date());
          }
        }
      }
    }

    if(coinsByTokenSymbol?.length === 0) {
      await updateToken(token, undefined, undefined, new Date());
    }
  }

  return tokens
}
