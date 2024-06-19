import {AnalyticEvent, AnalyticEventName} from "../../services/push/types";
import {CommentTemplateCompiler} from "./comment-template-compiler";
import {Template} from "./template";
import {warn} from "../../../services/logging";
import {ErrorMessages} from "../../errors/error-messages";


export function getTemplateCompiler({name}: Pick<AnalyticEvent, "name">): Template {
  switch (name) {
  case AnalyticEventName.COMMENT_PROPOSAL, AnalyticEventName.COMMENT_DELIVERABLE:
    return new CommentTemplateCompiler();
  default:
    warn(ErrorMessages.UnknownTemplateCompiler, {name});
    return null;
  }
}