import { TokenPrice } from "interfaces/token";

import { api } from "services/api";

interface tokens {
  address: string;
  chainId: number;
}

/**
 * Get Tokens Prices from api
 * @returns prices
 */
export async function useGetPrices(tokens: tokens[]): Promise<TokenPrice[]> {
  return api.post("/check-prices", { tokens }).then(({ data }) => data);
}
