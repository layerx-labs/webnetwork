import {AnalyticEventName} from "../services/push/types";

const basePath = "server/templates";

export const GeneralTemplates = {
  RSS: `${basePath}/rss.hbs`
}
export const EmailTemplates = {
  EmailVerification: `${basePath}/emails/email-verification.hbs`,
}

export const EmailNotificationSubjects: { [k in AnalyticEventName]?: string } = {
  COMMENT_PROPOSAL: "A comment has been made on your proposal",
  COMMENT_DELIVERABLE: "A comment has been made on your deliverable",
  COMMENT_TASK: "A comment has been made on your task",
  REPLY_TO_THREAD_CREATOR: "A new reply on your comment",
  REPLY_TO_THREAD_PARTICIPANT: "A new reply on a thread you participate",
  SUBSCRIBER_COMMENT: "A new comment on a task you're subscribed"
}