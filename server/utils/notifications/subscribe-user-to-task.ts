import models from "db/models";

import { Logger } from "services/logging";

export async function subscribeUserToTask(taskId: number, userId: number) {
  const user = await models.user.findOne({ where: { id: userId } });

  if (!user) {
    Logger.warn(`Failed to subscribeUserToTask: user not found`, { taskId, userId });
    return;
  }

  const task = await models.issue.findOne({
    where: {
      id: taskId
    }
  });

  if (!task) {
    Logger.warn(`Failed to subscribeUserToTask: task not found`, { taskId, userId });
    return;
  }

  const settings = await models.notificationSettings.findOne({
    where: {
      userId: user.id
    }
  });

  
  if (!settings?.subscriptions) {
    Logger.warn(`Failed to subscribeUserToTask: notification settings not found`, { taskId, userId });
    return;
  }

  if (!settings.subscriptions.includes(taskId))
    await settings.update({
      subscriptions: [...settings.subscriptions, taskId]
    });
}