import { api } from "services/api";

interface UseAddTokenParams {
  address: string;
  minAmount: string;
  chainId: number;
}
export async function useAddToken(payload: UseAddTokenParams) {
  return api
    .post("/token", payload)
    .then(({ data }) => data);
}