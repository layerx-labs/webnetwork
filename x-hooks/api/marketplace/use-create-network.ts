import { api } from "services/api";

import { CreateNetworkParams } from "types/api";

export default async function useCreateNetwork(payload: CreateNetworkParams): Promise<number> {
  return api
    .post("/marketplace", payload)
    .then(({ data }) => data);
}