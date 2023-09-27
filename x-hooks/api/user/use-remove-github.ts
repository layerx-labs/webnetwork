import { api } from "services/api";

interface UseRemoveGithubParams {
  address: string;
  githubLogin: string;
}

export  async function useRemoveGithub(payload: UseRemoveGithubParams) {
  return api
    .patch("/user/reset", payload);
}