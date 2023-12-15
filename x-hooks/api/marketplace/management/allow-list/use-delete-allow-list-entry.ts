import { api } from "services/api";

export default async function useDeleteAllowListEntry(networkId: number, address: string, type: "open" | "close") {
  return api.delete<string[]>(`/marketplace/management/${networkId}/whitelist/${address}?type=${type}`)
    .then(d => d.data);
}