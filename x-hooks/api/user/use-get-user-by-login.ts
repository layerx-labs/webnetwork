import { User } from "interfaces/api";

import { api } from "services/api";

export async function useGetUserByLogin(login: string): Promise<User> {
  return api
    .post<User[]>("/search/users/login/", { handle: login })
    .then(({ data }) => data[0]);
}