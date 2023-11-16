import models from "db/models";

import { COINGECKO_API } from "services/coingecko";

import { HttpConflictError, HttpServerError } from "server/errors/http-errors";

async function updateToken (token, prices, updatedAt: Date) {
  token.last_price_used = {
      ...prices,
      updatedAt,
  };
  await token.save();
}

export default async function FillPriceTokensDatabase() {
  const currencys = ['usd', 'btc', 'eth', 'eur']

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

  if(!coinsExistInDb?.length) {
    for(const t of tokens) await updateToken(t, undefined, new Date());
    throw new HttpConflictError("coingecko did not find the id for the tokens");
  }

  const ids = coinsExistInDb.map(({ id }) => id).join();

  const price = await COINGECKO_API.get(`/simple/price?ids=${ids}&vs_currencies=${currencys.join()}`);

  if (!price?.data) {
    for(const t of tokens) await updateToken(t, undefined, new Date());
    throw new HttpServerError("Error to get prices coingecko");
  }
  
  const pricesBySymbol = coinsExistInDb.reduce((res, { symbol, id }) => {
    res[symbol.toLowerCase()] = currencys.reduce((accumulator, value) => {
      accumulator[value] = price?.data?.[id]?.[value];
      return accumulator;
    }, {})
    return res;
  }, {});

  for (const token of tokens) {
    const lowercaseSymbol = token.symbol.toLowerCase();
    const coinsByTokenSymbol = coinsExistInDb.filter(v => v.symbol.toLowerCase() === token.symbol.toLowerCase())
    if (coinsByTokenSymbol.length === 1) {
      await updateToken(token, pricesBySymbol[lowercaseSymbol], new Date());
    }

    if(coinsByTokenSymbol.length > 1) {
      for(const ctoken of coinsExistInDb){
        const platforms: { [key: string]: string } = ctoken.platforms
        for(const [, value] of Object.entries(platforms)){
          if(value.toLowerCase() === token.address.toLowerCase()){
            await updateToken(token,
                              currencys.reduce((accumulator, value) => {
                                accumulator[value] = price?.data?.[ctoken.id]?.[value];
                                return accumulator;
                              }, {}),
                              new Date());
          }
        }
      }
    }

    if(coinsByTokenSymbol?.length === 0) {
      await updateToken(token, undefined, new Date());
    }
  }

  return tokens
}
