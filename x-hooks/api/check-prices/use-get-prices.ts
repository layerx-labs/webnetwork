import { api } from "services/api";

interface tokens {
  address: string;
  chainId: number;
}

/**
 * Get Tokens Prices from api
 * @returns prices
 */
export async function useGetPrices(tokens: tokens[]) {
  return api.post("/check-prices", { tokens }).then(({ data }) => data);
}
