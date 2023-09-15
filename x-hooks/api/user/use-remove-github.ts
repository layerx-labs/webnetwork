import { api } from "services/api";

export  async function useRemoveGithub(address: string, githubLogin: string) {
  return api
    .post("/user/reset", { address, githubLogin });
}