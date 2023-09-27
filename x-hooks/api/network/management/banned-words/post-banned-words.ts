import { api } from "services/api";

interface payloadProps {
  banned_domain: string;
  networkAddress: string;
  networkId: number;
}

/**
 * Create Banned Word in api with network params
 * @param query current url query
 * @returns created Banned Word on Network
 */
export async function CreateBannedWord({ networkId, ...rest }: payloadProps): Promise<string[]> {
  return api
    .post<string[]>(`/network/management/banned-words/${networkId}`, rest)
    .then(({ data }) => data);
}
