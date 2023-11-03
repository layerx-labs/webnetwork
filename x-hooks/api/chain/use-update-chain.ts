import { api } from "services/api";

interface UseUpdateChainParams {
  chainId: number;
  registryAddress?: string;
  eventsApi?: string;
  explorer?: string;
  lockAmountForNetworkCreation?: string | number;
  networkCreationFeePercentage?: string | number;
  closeFeePercentage?: string | number;
  cancelFeePercentage?: string | number;
}

export async function useUpdateChain({ chainId, ...rest }: UseUpdateChainParams) {
  return api
    .patch(`/chains/${chainId}`, rest)
    .then(({ data }) => data);
}