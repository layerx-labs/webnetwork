import { api } from "services/api";

import { UpdateNetworkParams } from "types/api";

export async function useUpdateNetwork(payload: UpdateNetworkParams): Promise<string> {
  return api
    .put("/marketplace", payload)
    .then(({ data }) => data);
}