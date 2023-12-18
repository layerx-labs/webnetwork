import { api } from "services/api";

export async function useUpdateReadAllNotifications(address: string) {
  return api.put(`/notifications/${address}/read`).then(({ data }) => data);
}
