import models from "db/models";
import NotificationSettings from "db/models/notification-settings.model";

import { Logger } from "services/logging";

export type NotificationType = keyof Omit<NotificationSettings, "id" | "userId" | "subscriptions">;

type GetUserNotificationSettingsOutput = {
  enabled: boolean,
  notifications: NotificationType[],
  subscriptions: number[],
}

export async function getUserNotificationSettings(userId: number): Promise<GetUserNotificationSettingsOutput> {
  const where = {
    userId: userId
  };

  const userSettings = await models.userSetting.findOne({ where });

  const notificationSettings = await models.notificationSettings.findOne({ where, raw: true });

  const notifications = [];

  for (const key in notificationSettings) {
    if (["id", "userId", "subscriptions"].includes(key))
      continue;

    if (notificationSettings[key])
      notifications.push(key);
  }

  return {
    enabled: !!userSettings?.notifications,
    subscriptions: notificationSettings?.subscriptions || [],
    notifications,
  }
}

export async function shouldSendNotification( userId: number,
                                              notificationType: NotificationType,
                                              taskId?: number): Promise<boolean> {
  try {
    const { enabled, subscriptions, notifications } = await getUserNotificationSettings(userId);

    const isSubscribedToTask = taskId ? subscriptions.includes(taskId) : false;
    const isNotificationTypeEnabled = enabled && notifications.includes(notificationType);
  
    return isSubscribedToTask || isNotificationTypeEnabled;

  } catch(error) {
    Logger.warn("Failed to verify if should send notification", { error, userId,  notificationType });
  }

  return false;
}