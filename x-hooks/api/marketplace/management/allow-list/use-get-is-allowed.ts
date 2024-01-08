import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

export default function useGetIsAllowed (networkId: number, address: string, type: AllowListTypes) {
  return api.get<{ allowed: boolean }>(`/marketplace/management/${networkId}/allowlist/${type}/${address}`)
    .then(d => d.data);
}