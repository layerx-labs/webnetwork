import { NotificationSettings } from "interfaces/user-notification";

import { api } from "services/api";

interface UseUpdateNotificationSettingsPayload extends Omit<NotificationSettings, "id" | "userId" | "subscriptions">{
  address: string;
}

export async function useUpdateNotificationSettings({
  address,
  ...rest
}: UseUpdateNotificationSettingsPayload) {
  return api.
    put(`/user/${address}/notification-settings`, rest);
}