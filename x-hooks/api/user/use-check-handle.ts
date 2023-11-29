import { api } from "services/api";

export async function useCheckHandle(handle: string): Promise<boolean> {
  return api
    .get<boolean>(`/user/check-handle/${handle}`, )
    .then(({ data }) => data);
}