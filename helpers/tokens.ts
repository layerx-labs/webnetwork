import BigNumber from "bignumber.js";

import { TokenPrice } from "interfaces/token";

import { ConvertableItem, ConvertedItem } from "types/utils";


function getPricesAndConvert<T>(
  items: ConvertableItem[],
  fiatSymbol: string,
  tokensPrice: TokenPrice[]
) {
  const coingeckoPrices = items
    .reduce((acc, value) => acc.concat(value), [])
    .map((v, key) => ({
      address: v.token.address,
      chainId: v.token.chain_id,
      price: tokensPrice[key][fiatSymbol],
    }));

  const prices = items.map((item) => ({
    ...item,
    price:
      coingeckoPrices.find(
        (v) =>
          v.address === item.token.address && v.chainId === item.token.chain_id
      ).price || 0,
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