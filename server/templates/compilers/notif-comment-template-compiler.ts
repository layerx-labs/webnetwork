import {Template} from "./template";
import Handlebars from "handlebars";
import {CommentPushProps} from "../../services/push/types";

export class NotifCommentTemplateCompiler extends Template {

  constructor() {
    super("server/templates/");
  }

  compile(payload: CommentPushProps) {

    const actionUrlEntryPart =
      payload.data.entryId
        ? (payload.type === "NOTIF_COMMENT_DELIVERABLE" ? `deliverable` : `proposal`).concat("/", payload.data.entryId, "/")
        : ""

    const actionUrlPart =
      `${payload.data.marketplace}/task/${payload.data.taskId}/${actionUrlEntryPart}`;

    const type =
      payload.type === "NOTIF_COMMENT_DELIVERABLE"
        ? "deliverable"
        : payload.type === "NOTIF_COMMENT_PROPOSAL"
          ? "proposal"
          : "task"

    const templateData = {
      comment: payload.data.comment,
      type,
      actionHref: `${actionUrlPart}/`,
      creator: payload.data.creator
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("notifs/comment.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}