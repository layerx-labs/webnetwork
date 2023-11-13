import {api} from "../../../../../services/api";

export default async function useDeleteAllowListEntry(networkId: number, address: string) {
  return api.delete<string[]>(`/marketplace/management/${networkId}/whitelist/${address}`)
    .then(d => d.data);
}