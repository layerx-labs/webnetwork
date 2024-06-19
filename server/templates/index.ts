import {Templates} from "../services/notifications/templates";

const basePath = "server/templates";

export const GeneralTemplates = {
  RSS: `${basePath}/rss.hbs`
}
export const EmailTemplates = {
  EmailVerification: `${basePath}/emails/email-verification.hbs`,
}

export const EmailNotificationSubjects: { [k in keyof typeof Templates]: string } = {
  COMMENT_PROPOSAL: "A comment has been made on your proposal",
  COMMENT_DELIVERABLE: "A comment has been made on your deliverable"
}