import { useState } from "react";

import isTokenArrayEqual from "helpers/is-token-array-equal";

import { TokenPrice } from "interfaces/token";

import { useGetPrices } from "./api/check-prices/use-get-prices";
interface PricesProps {
  address: string;
  chainId: number;
  last_price_used: TokenPrice;
}

export interface getPriceParams {
  address: string;
  chainId: number;
}

export default function useCoingeckoPrice() {
  const [tokensPrice, setTokensPrice] = useState<PricesProps[]>();

  async function getPriceFor(tokens: getPriceParams[]) {                                      

    if(isTokenArrayEqual(tokens, tokensPrice)) return tokensPrice.map(v => v.last_price_used)

    const prices = await useGetPrices(tokens).then((v) => {
      setTokensPrice(v.map((price, key) => ({
          ...tokens[key],
          last_price_used: price
      })))
      return v
    })

    return prices
  }

  return {
    getPriceFor,
  };
}
