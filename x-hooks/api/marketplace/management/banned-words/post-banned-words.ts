import { api } from "services/api";

interface payloadProps {
  banned_domain: string;
  networkAddress: string;
}

/**
 * Create Banned Word in api with network params
 * @param query current url query
 * @returns created Banned Word on Network
 */
export async function CreateBannedWord(id, payload: payloadProps): Promise<string[]> {
  return api
    .post<string[]>(`/marketplace/management/banned-words/${id}`, payload)
    .then(({ data }) => data);
}
