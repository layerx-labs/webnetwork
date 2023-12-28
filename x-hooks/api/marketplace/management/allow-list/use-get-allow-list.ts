import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

export default async function useGetAllowList(networkId: number, type: AllowListTypes) {
  return api.get<string[]>(`/marketplace/management/${networkId}/allowlist/${type}`)
    .then(d => d.data)
    .catch(e => {
      console.debug(`Error fetching allow list`, e);
      return [];
    });
}