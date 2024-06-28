import {AnalyticEvent, AnalyticEventName} from "../../services/push/types";
import {EmailCommentTemplateCompiler} from "./email-comment-template-compiler";
import {Template} from "./template";
import {warn} from "../../../services/logging";
import {ErrorMessages} from "../../errors/error-messages";
import {NotifCommentTemplateCompiler} from "./notif-comment-template-compiler";


export function getTemplateCompiler({name}: Pick<AnalyticEvent, "name">): Template {
  switch (name) {
  case AnalyticEventName.COMMENT_PROPOSAL, AnalyticEventName.COMMENT_DELIVERABLE, AnalyticEventName.COMMENT_TASK:
    return new EmailCommentTemplateCompiler();
  case AnalyticEventName.NOTIF_COMMENT_PROPOSAL, AnalyticEventName.NOTIF_COMMENT_DELIVERABLE, AnalyticEventName.NOTIF_COMMENT_TASK:
    return new NotifCommentTemplateCompiler();
  default:
    warn(ErrorMessages.UnknownTemplateCompiler, {name});
    return null;
  }
}