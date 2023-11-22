import { api } from "services/api";

export async function useGetTotalUsers(): Promise<number> {
  return api
    .get<number>("/search/users/total/")
    .then(({ data }) => data)
    .catch(() => 0);
}