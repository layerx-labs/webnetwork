import {api} from "services/api";

interface UseRemoveGithubParams {
  address: string;
  handle: string;
}

export  async function useRemoveGithub(payload: UseRemoveGithubParams) {
  return api
    .patch("/user/reset", payload);
}