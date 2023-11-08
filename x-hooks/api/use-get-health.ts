import { AxiosResponse } from "axios";

import { api } from "services/api";

export async function useGetHealth(): Promise<AxiosResponse> {
  return api.get("/health");
}