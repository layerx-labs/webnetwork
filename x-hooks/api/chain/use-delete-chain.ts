import { api } from "services/api";

export async function useDeleteChain(chain) {
  return api.delete("/chains", { params: { id: chain.chainId }});
}