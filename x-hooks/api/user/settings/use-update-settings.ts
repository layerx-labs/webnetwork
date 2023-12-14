import { api } from "services/api";

export async function useUpdateUserSettings(settings: {
  notifications?: boolean;
  language?: string;
}) {
  return api.post(`/user/settings`, { settings }).then(({ data }) => data);
}