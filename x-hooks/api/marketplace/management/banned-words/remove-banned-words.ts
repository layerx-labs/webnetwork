import { api } from "services/api";

interface payloadProps {
  banned_domain: string;
  networkAddress: string;
}

/**
 * Remove Banned Word in api with network params
 * @param query current url query
 * @returns new Banned Words on Network
 */
export async function RemoveBannedWord(id, payload: payloadProps): Promise<string[]> {
  return api
    .patch<string[]>(`/marketplace/management/banned-words/${id}`, payload)
    .then(({ data }) => data)
}
