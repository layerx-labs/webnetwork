import { api } from "services/api";

export async function useUpdateFullName({ fullName, address }: {
  fullName: string;
  address: string;
}) {
  return api
    .put(`/user/${address}/full-name`, { fullName })
    .then(({ data }) => data);
}
