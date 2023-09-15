import { SupportedChainData } from "interfaces/supported-chain-data";

import { api } from "services/api";

export async function useUpdateChain(payload: Partial<SupportedChainData>) {
  return api.patch("chains", payload);
}