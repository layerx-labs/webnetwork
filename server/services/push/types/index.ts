import {analytic} from "../utils/analytic";

export type EmailNotificationTarget = Pick<any, "email" | "id" | "settings">;
export type EmailNotificationTargets = EmailNotificationTarget[];

export type PushProps<D = object> = {
  type: AnalyticEventName;
  data: { marketplace: string } & D;
  uuid?: string;
  target: EmailNotificationTargets;
}

export type CommentPushProps =
  PushProps<
    {
      comment: string;
      madeBy: string;
      taskId: string;
      entryId?: string;
      creator?: string;
      type?: "task" | "proposal" | "deliverable"
    }
  >

export type ReplyThreadPushProps =
  PushProps<
    {
      comment: string;
      creator: string;
      target: string;
      type: "creator" | "participant";
      taskId: string;
      deliverableId?: string;
      proposalId?: string;
    }
  >

export type CollectEventPayload = { name: string; params: PushProps<any> };
export type Analytic = { type: AnalyticTypes };
export type AnalyticEvent = { name: AnalyticEventName, params: PushProps<any> }
export type AnalyticEvents = AnalyticEvent[];
export type AnalyticEventPool = { [k in AnalyticEventName]?: Analytic[] }

export enum AnalyticEventName {
  COMMENT_PROPOSAL = "COMMENT_PROPOSAL",
  NOTIF_COMMENT_PROPOSAL = "NOTIF_COMMENT_PROPOSAL",
  COMMENT_DELIVERABLE = "COMMENT_DELIVERABLE",
  NOTIF_COMMENT_DELIVERABLE = "NOTIF_COMMENT_DELIVERABLE",
  COMMENT_TASK = "COMMENT_TASK",
  NOTIF_COMMENT_TASK = "NOTIF_COMMENT_TASK",
  REPLY_TO_THREAD_CREATOR = "REPLY_TO_THREAD_CREATOR",
  NOTIF_REPLY_TO_THREAD_CREATOR = "NOTIF_REPLY_TO_THREAD_CREATOR",
  REPLY_TO_THREAD_PARTICIPANT = "REPLY_TO_THREAD_PARTICIPANT",
  NOTIF_REPLY_TO_THREAD_PARTICIPANT = "NOTIF_REPLY_TO_THREAD_PARTICIPANT",
  SUBSCRIBER_COMMENT = "SUBSCRIBER_COMMENT",
  NOTIF_SUBSCRIBER_COMMENT = "NOTIF_SUBSCRIBER_COMMENT",
}

export enum AnalyticTypes {
  EmailNotification = "send-grid-email-notif",
  CreateNotification = "create-notification",
}

export const AnalyticsEvents: AnalyticEventPool = {
  [AnalyticEventName.COMMENT_PROPOSAL]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_COMMENT_PROPOSAL]: [analytic(AnalyticTypes.CreateNotification)],
  [AnalyticEventName.COMMENT_DELIVERABLE]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_COMMENT_DELIVERABLE]: [analytic(AnalyticTypes.CreateNotification)],
  [AnalyticEventName.COMMENT_TASK]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_COMMENT_TASK]: [analytic(AnalyticTypes.CreateNotification)],
  [AnalyticEventName.REPLY_TO_THREAD_CREATOR]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_REPLY_TO_THREAD_CREATOR]: [analytic(AnalyticTypes.CreateNotification)],
  [AnalyticEventName.REPLY_TO_THREAD_PARTICIPANT]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_REPLY_TO_THREAD_PARTICIPANT]: [analytic(AnalyticTypes.CreateNotification)],
  [AnalyticEventName.SUBSCRIBER_COMMENT]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.NOTIF_SUBSCRIBER_COMMENT]: [analytic(AnalyticTypes.CreateNotification)],
}
