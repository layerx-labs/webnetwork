import { api } from "services/api";

export async function useDeleteChain(chainId: number) {
  return api
    .delete(`/chains/${chainId}`)
    .then(({ data }) => data);
}