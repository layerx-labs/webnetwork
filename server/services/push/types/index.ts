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
  NOTIF_COMMENT_TASK = "NOTIF_COMMENT_TASK"
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
}
