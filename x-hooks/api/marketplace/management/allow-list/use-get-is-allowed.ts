import {api} from "../../../../../services/api";

export default function useGetIsAllowed(networkId: number, address: string) {
  return api.get<{ allowed: boolean }>(`/marketplace/management/${networkId}/whitelist/${address}`)
    .then(d => d.data);
}