import {api} from "../../../../../services/api";

export default async function useGetAllowList(networkId: number) {
  return api.get<string[]>(`/marketplace/management/${networkId}/whitelist/`)
    .then(d => d.data)
    .catch(e => {
      console.debug(`Error fetching allow list`, e);
      return [];
    });
}