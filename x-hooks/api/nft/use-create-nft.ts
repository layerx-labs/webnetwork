import { api } from "services/api";

interface UseCreateNftParams {
  issueId: number;
  proposalId: number;
}

export async function useCreateNft(payload: UseCreateNftParams) {
  return api
    .post("/nft", payload)
    .then(({ data }) => data);
}