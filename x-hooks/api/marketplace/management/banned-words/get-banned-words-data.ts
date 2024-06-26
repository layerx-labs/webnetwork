import { api } from "services/api";

/**
 * Get Banned Words from api based on network id
 * @param query current url query
 * @returns list of Banned Words
 */
export async function getBannedWordsData(id: number | string): Promise<string[]> {
  return api
    .get<string[]>(`/marketplace/management/banned-words/${id}`)
    .then(({ data }) => data)
}
