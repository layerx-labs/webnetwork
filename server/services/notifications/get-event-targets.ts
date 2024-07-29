import models from "db/models";

import { CreateNotificationPayload } from "server/services/push/actors/create-notification";
import { AnalyticEventName, CommentPushProps } from "server/services/push/types";
import { NotificationType, shouldSendNotification } from "server/utils/notifications/get-user-notification-settings";

type Target = Pick<typeof models.user, "email" | "id" | "settings">;

const analyticToNotificationMap = {
  [AnalyticEventName.COMMENT_DELIVERABLE]: "commentsOnDeliverables",
  [AnalyticEventName.COMMENT_PROPOSAL]: "commentsOnProposals",
  [AnalyticEventName.COMMENT_TASK]: "commentsOnTasks",
  [AnalyticEventName.NOTIF_COMMENT_PROPOSAL]: "commentsOnProposals",
  [AnalyticEventName.NOTIF_COMMENT_DELIVERABLE]: "commentsOnDeliverables",
  [AnalyticEventName.NOTIF_COMMENT_TASK]: "commentsOnTasks",
  [AnalyticEventName.REPLY_TO_THREAD_CREATOR]: "replyOnThreads",
  [AnalyticEventName.NOTIF_REPLY_TO_THREAD_CREATOR]: "replyOnThreads",
  [AnalyticEventName.REPLY_TO_THREAD_PARTICIPANT]: "replyOnThread",
  [AnalyticEventName.NOTIF_REPLY_TO_THREAD_PARTICIPANT]: "replyOnThreads",
};

export async function getEventTargets(payload: CreateNotificationPayload, targets?: Target[]) {
  const notificationType = analyticToNotificationMap[payload.type] as NotificationType;

  if (!targets?.length)
    targets = await models.user.findAll({
      include: [
        {
          association: "settings",
          required: true,
          where: {
            notifications: true
          }
        }
      ]
    });

  const taskId = "taskId" in payload.data ? +(payload as CommentPushProps).data.taskId : undefined;

  targets = (await Promise.all(targets.map(async (target) => {
    const shouldSend = 
        await shouldSendNotification(target.id, notificationType, taskId);

    if (!shouldSend)
      return null;

    return target;
  }))).filter(target => !!target);

  const reduceTargetToRecipientIds = (p: {
    recipients: string[],
    ids: number[]
  }, c: Pick<typeof models.user, "email" | "id" | "settings">) =>
    ({recipients: [...p.recipients, c.email], ids: [...p.ids, c.id]}) as { recipients: string[], ids: number[] };

  return targets.reduce(reduceTargetToRecipientIds, {recipients: [], ids: []});
}