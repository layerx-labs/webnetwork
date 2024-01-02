import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

export default async function useDeleteAllowListEntry (networkId: number,
                                                       address: string,
                                                       type: AllowListTypes) {
  return api
    .delete<string[]>(`/marketplace/management/${networkId}/allowlist/${type}/${address}`)
    .then(d => d.data);
}