import getConfig from "next/config";

import models from "db/models";

import { COINGECKO_API } from "services/coingecko";

const {publicRuntimeConfig: {
    currency
  }} = getConfig();

export default async function FillPriceTokensDatabase() {
  const currencys = currency || "usd";

  const coins = await COINGECKO_API.get(`/coins/list?include_platform=true`).then((value) => value.data);

  const tokens = await models.tokens.findAll({});

  const dbSymbols = [...new Set(tokens.map(({ symbol }) => symbol?.toLowerCase()))]
  const coinsBySymbolOnDb = coins.filter((token) => dbSymbols.includes(token.symbol?.toLowerCase()));

  const coinsExistInDb = []
 
  if(coinsBySymbolOnDb?.length !== dbSymbols?.length){
    for(const coinBySymbolOnDb of coinsBySymbolOnDb){
      const uniqueSymbol = coinsBySymbolOnDb.filter(v => v.symbol === coinBySymbolOnDb.symbol)?.length === 1
      const platforms: { [key: string]: string } = coinBySymbolOnDb.platforms

      if(!uniqueSymbol){
        for (const [, value] of Object.entries(platforms)) { 
          if(tokens.find(t => t?.address?.toLowerCase() === value?.toLowerCase()))
            coinsExistInDb.push(coinBySymbolOnDb)
        }
      }
      
      if(uniqueSymbol) coinsExistInDb.push(coinBySymbolOnDb)
    }
  }

  if(!coinsExistInDb?.length) throw new Error("coingecko did not find the id for the tokens");

  const ids = coinsExistInDb.map(({ id }) => id).join();

  const price = await COINGECKO_API.get(`/simple/price?ids=${ids}&vs_currencies=${currencys}`);

  if (!price?.data) {
    throw new Error("Error to get prices coingecko");
  }

  const pricesBySymbol = coinsExistInDb.reduce((res, { symbol, id }) => {
    res[symbol.toLowerCase()] = { [currencys]: price?.data?.[id]?.[currencys] };
    return res;
  }, {});

  for (const token of tokens) {
    const coinsByTokenSymbol = coinsExistInDb.filter(v => v.symbol.toLowerCase() === token.symbol.toLowerCase())
    const uniqueSymbol = coinsByTokenSymbol?.length === 1

    if (pricesBySymbol[token.symbol.toLowerCase()] && uniqueSymbol) {
      token.last_price_used = {
        ...pricesBySymbol[token.symbol.toLowerCase()],
        updatedAt: new Date(),
      };
      await token.save();
    }

    if(!uniqueSymbol) {
      for(const ctoken of coinsExistInDb){
        const platforms: { [key: string]: string } = ctoken.platforms
        for(const [, value] of Object.entries(platforms)){
          if(value.toLowerCase() === token.address.toLowerCase()){
            token.last_price_used = {
              [currencys]: price?.data?.[ctoken.id]?.[currencys],
              updatedAt: new Date(),
            }
            await token.save();
          }
        }
      }
    }
  }

  return tokens
}
