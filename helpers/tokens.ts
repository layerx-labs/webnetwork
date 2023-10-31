import BigNumber from "bignumber.js";

import { TokenPrice } from "interfaces/token";

import { ConvertableItem, ConvertedItem } from "types/utils";

import { getPriceParams } from "x-hooks/use-coingecko-price";

async function getPricesAndConvert<T>(items: ConvertableItem[],
                                      fiatSymbol: string,
                                      getPriceFor: (v: getPriceParams[]) => Promise<TokenPrice[]>) {

  const tokens = items.map((item) => ({ address: item.token.address, chainId: item.token.chain_id }))
  const coingeckoPrices = await getPriceFor(tokens)
  
  const prices = items.map((item, key) => ({
    ...item,
    price: coingeckoPrices[key][fiatSymbol?.toLowerCase()] || 0
  }));

  const convert = ({ value, price}) => BigNumber(value * price);
  const hasPrice = ({ price }) => price > 0;
  const toConverted = item => ({
    ...item,
    converted: convert(item)
  });

  const converted = prices.filter(hasPrice).map(toConverted) as (T & ConvertedItem)[];
  const noConverted = prices.filter(item => !hasPrice(item)) as ConvertableItem[];
  const totalConverted = BigNumber(converted.reduce((acc, curr) => acc.plus(convert(curr)), BigNumber(0)));

  return {
    converted,
    noConverted,
    totalConverted,
  };
}

export {
  getPricesAndConvert
};