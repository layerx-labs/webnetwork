import {analytic} from "../utils/analytic";

export type EmailNotificationTarget = Pick<any, "email" | "id" | "user_settings">;
export type EmailNotificationTargets = EmailNotificationTarget[];

export type PushProps<D = object> = {
  type: AnalyticEventName;
  data: D;
  uuid?: string;
  marketplace: string;
  target: EmailNotificationTargets;
}

export type CommentPushProps =
  PushProps<
    {
      comment: string;
      madeBy: string;
      taskId: string;
      entryId?: string;
    }
  >

export type CollectEventPayload = { name: string; params: PushProps<any> };
export type Analytic = { type: AnalyticTypes };
export type AnalyticEvent = { name: AnalyticEventName, params: PushProps<any> }
export type AnalyticEvents = AnalyticEvent[];
export type AnalyticEventPool = { [k in AnalyticEventName]?: Analytic[] }

export enum AnalyticEventName {
  COMMENT_PROPOSAL = "COMMENT_PROPOSAL",
  COMMENT_DELIVERABLE = "COMMENT_DELIVERABLE",
  COMMENT_TASK = "COMMENT_TASK"
}

export enum AnalyticTypes {
  EmailNotification = "send-grid-email-notif",
}

export const AnalyticsEvents: AnalyticEventPool = {
  [AnalyticEventName.COMMENT_PROPOSAL]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.COMMENT_DELIVERABLE]: [analytic(AnalyticTypes.EmailNotification)],
  [AnalyticEventName.COMMENT_TASK]: [analytic(AnalyticTypes.EmailNotification)],
}
