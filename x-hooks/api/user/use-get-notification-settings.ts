import { NotificationSettings } from "interfaces/user-notification";

import { api } from "services/api";

export async function useGetUserNotificationSettings(address: string): Promise<NotificationSettings | null> {
  return api
    .get(`/user/${address}/notification-settings`)
    .then(({ data }) => data)
    .catch(() => null);
}