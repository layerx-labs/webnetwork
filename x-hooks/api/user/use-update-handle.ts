import { api } from "services/api";

export async function useUpdateHandle({
  address,
  handle,
}: {
  address: string;
  handle: string;
}) {
  return api.put(`/user/${address}/handle/${handle}`).then(({ data }) => data);
}
