import { AllowListTypes } from "interfaces/enums/marketplace";

import { api } from "services/api";

interface useAddAllowListEntryProps {
  networkId: number;
  address: string;
  networkAddress: string;
  type: AllowListTypes;
}

export default async function useAddAllowListEntry ({
  networkId,
  address,
  networkAddress,
  type,
}: useAddAllowListEntryProps) {
  return api
    .post<string[]>(`/marketplace/management/${networkId}/allowlist/${type}/${address}`, {
      networkAddress
    })
    .then(d => d.data);
}