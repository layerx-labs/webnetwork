import { useState } from "react";

import { QueryKeys } from "helpers/query-keys";

import { TokenPrice } from "interfaces/token";

import { useGetPrices } from "./api/check-prices/use-get-prices";
import useReactQuery from "./use-react-query";

import isTokenArrayEqual from "helpers/is-token-array-equal";

interface Last_price_used {
  [key: string]: number | string;
}

interface PricesProps {
  address: string;
  chainId: number;
  last_price_used: TokenPrice;
}

interface getPriceParams {
  address: string;
  chainId: number;
}

export default function useCoingeckoPrice() {
  const [tokensPrice, setTokensPrice] = useState<PricesProps[]>();

  async function getPriceFor(tokens: getPriceParams[]) {
    /*const { data: prices } = await useReactQuery(QueryKeys.pricesByCoingecko(tokens),
                                                 async () => useGetPrices(tokens),
                                                 {
        enabled: !!tokens,
                                                 });*/
                                                 

    if(isTokenArrayEqual(tokens, tokensPrice)) return tokensPrice.map(v => v.last_price_used)

    const prices = await useGetPrices(tokens).then((v) => {
      setTokensPrice(v.map((price, key) => ({
          ...tokens[key],
          last_price_used: price
      })))
      return v
    })
    console.log('cheguei aqui 2', prices)
    return prices
  }

  return {
    getPriceFor,
  };
}
