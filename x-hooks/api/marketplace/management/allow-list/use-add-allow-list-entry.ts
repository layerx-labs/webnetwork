import {api } from "services/api";

export default async function useAddAllowListEntry( networkId: number,
                                                    address: string,
                                                    networkAddress: string,
                                                    type: "open" | "close") {
  return api.post<string[]>(`/marketplace/management/${networkId}/whitelist/${address}?type=${type}`, {
    networkAddress
  })
    .then(d => d.data);
}