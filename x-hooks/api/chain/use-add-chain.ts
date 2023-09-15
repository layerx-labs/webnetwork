import { MiniChainInfo } from "interfaces/mini-chain";

import { api } from "services/api";

export async function useAddChain(chain: MiniChainInfo) {
  return api
    .post("/chains", chain)
    .then(({ data }) => data);
}