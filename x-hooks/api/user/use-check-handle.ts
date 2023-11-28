import { api } from "services/api";

export async function useCheckHandle(handle: string): Promise<boolean> {
  return api
    .post<boolean>("/user/check-handle/", [handle])
    .then(({ data }) => data);
}