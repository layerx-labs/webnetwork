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
  COMMENT_TASK: "A comment has been made on your task"
}