import { Token } from "interfaces/token";

import { api } from "services/api";

interface useGetTokensParams {
  chainId?: string;
  networkName?: string;
  chainShortName?: string;
  type?: string;
}
export async function useGetTokens(params?: useGetTokensParams) {
  return api
    .get<Token[]>("/search/tokens", { params })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
}