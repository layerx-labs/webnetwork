import {analytic} from "../utils/analytic";


export type CollectEventPayload = { name: string; params: any };
export type Analytic = { type: AnalyticTypes };
export type AnalyticEvent = { name: AnalyticEventName, params: any }
export type AnalyticEvents = AnalyticEvent[];
export type AnalyticEventPool = { [k in AnalyticEventName]?: Analytic[] }

export enum AnalyticEventName {
  COMMENT_PROPOSAL = "COMMENT_PROPOSAL",
  COMMENT_DELIVERABLE = "COMMENT_DELIVERABLE",
}

export enum AnalyticTypes {
  EmailNotification = "send-grid-email-notif",
}

export const AnalyticsEvents: AnalyticEventPool = {
  [AnalyticEventName.COMMENT_PROPOSAL]: [analytic(AnalyticTypes.EmailNotification)],
}