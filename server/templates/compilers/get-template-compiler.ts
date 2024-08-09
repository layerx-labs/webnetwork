import {AnalyticEvent, AnalyticEventName} from "../../services/push/types";
import {EmailCommentTemplateCompiler} from "./email-comment-template-compiler";
import {Template} from "./template";
import {warn} from "../../../services/logging";
import {ErrorMessages} from "../../errors/error-messages";
import {NotifCommentTemplateCompiler} from "./notif-comment-template-compiler";
import { NotifReplyThreadTemplateCompiler } from "server/templates/compilers/notif-reply-thread-template-compiler";
import { NotifCommentSubscriberTemplateCompiler } from "server/templates/compilers/notif-comment-subscriber-template-compiler";
import { EmailCommentSubscriberTemplateCompiler } from "server/templates/compilers/email-comment-subscriber-template-compiler";

export function getTemplateCompiler({name}: Pick<AnalyticEvent, "name">): Template {
  switch (name) {
  case AnalyticEventName.COMMENT_PROPOSAL:
  case AnalyticEventName.COMMENT_DELIVERABLE:
  case AnalyticEventName.COMMENT_TASK:
    return new EmailCommentTemplateCompiler();
  case AnalyticEventName.NOTIF_COMMENT_PROPOSAL:
  case AnalyticEventName.NOTIF_COMMENT_DELIVERABLE:
  case AnalyticEventName.NOTIF_COMMENT_TASK:
    return new NotifCommentTemplateCompiler();
  case AnalyticEventName.NOTIF_REPLY_TO_THREAD_CREATOR:
  case AnalyticEventName.NOTIF_REPLY_TO_THREAD_PARTICIPANT:
    return new NotifReplyThreadTemplateCompiler();
  case AnalyticEventName.SUBSCRIBER_COMMENT:
    return new EmailCommentSubscriberTemplateCompiler();
  case AnalyticEventName.NOTIF_SUBSCRIBER_COMMENT:
    return new NotifCommentSubscriberTemplateCompiler();
  default:
    warn(ErrorMessages.UnknownTemplateCompiler, {name});
    return null;
  }
}