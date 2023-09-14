import { api } from "services/api";

interface payloadProps {
  banned_domain: string;
  networkAddress: string;
  networkId: number;
}

/**
 * Remove Banned Word in api with network params
 * @param query current url query
 * @returns new Banned Words on Network
 */
export async function RemoveBannedWord({ networkId, ...rest }: payloadProps): Promise<string[]> {
  return api
    .patch<string[]>(`/network/management/banned-words/${networkId}`, rest)
    .then(({ data }) => data)
}
