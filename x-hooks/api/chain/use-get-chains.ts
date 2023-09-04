import { SupportedChainData } from "interfaces/supported-chain-data";

import { api } from "services/api";

export async function useGetChains(query: Partial<SupportedChainData> = null) {
  const params = new URLSearchParams(query as any);

  return api.get<{result: SupportedChainData[], error?: string; }>(`/chains`, {... query ? {params} : {}})
    .then(({data}) => data)
    .then(data => {
      if (data.error)
        console.debug(`failed to fetch supported chains`, data.error);

      return data?.result;
    })
    .catch(e => {
      console.error(`failed to fetch supported chains`, e);
      return [];
    })
}