import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

interface useDeleteAllowListEntry {
  networkId: number;
  address: string;
  type: AllowListTypes;
}

export default async function useDeleteAllowListEntry ({
  networkId,
  address,
  type,
}: useDeleteAllowListEntry) {
  return api
    .delete<string[]>(`/marketplace/management/${networkId}/allowlist/${type}/${address}`)
    .then(d => d.data);
}