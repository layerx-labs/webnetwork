import { User } from "interfaces/api";

import { api } from "services/api";

export async function useGetUserByLogin(login: string): Promise<User> {
  return api
    .post<User[]>("/search/users/login/", { identifier: login })
    .then(({ data }) => data[0]);
}