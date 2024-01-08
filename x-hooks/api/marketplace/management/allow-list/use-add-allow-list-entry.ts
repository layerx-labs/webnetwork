import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

export default async function useAddAllowListEntry (networkId: number,
                                                    address: string,
                                                    networkAddress: string,
                                                    type: AllowListTypes) {
  return api
    .post<string[]>(`/marketplace/management/${networkId}/allowlist/${type}/${address}`, {
      networkAddress
    })
    .then(d => d.data);
}