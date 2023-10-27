import { api } from "services/api";

interface useGetPricesProps {
  tokenAddress: string;
  chaindId: number;
}

/**
 * Get Tokens Prices from api
 * @param tokenAddress and @param chainId
 * @returns list of filtered chains
 */
export async function useGetPrices(payload: useGetPricesProps) {
  return api.post("/check-prices", payload).then(({ data }) => data);
}
