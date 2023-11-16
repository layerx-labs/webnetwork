import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { useGetPrices } from "./api/check-prices/use-get-prices";
import useReactQuery from "./use-react-query";

export interface getPriceParams {
  address: string;
  chainId: number;
}

export default function useCoingeckoPrice(tokens: getPriceParams[]) {
  return useReactQuery(QueryKeys.pricesByCoingecko(tokens || []),
                       async () => useGetPrices(tokens),
                       {
      enabled: !!tokens,
      staleTime: MINUTE_IN_MS
                       });
 
}
