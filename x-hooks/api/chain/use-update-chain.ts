import { api } from "services/api";

interface UseUpdateChainParams {
  chainId: number;
  registryAddress?: string;
  eventsApi?: string;
  explorer?: string;
}

export async function useUpdateChain({ chainId, ...rest }: UseUpdateChainParams) {
  return api
    .patch(`/chains/${chainId}`, rest)
    .then(({ data }) => data);
}