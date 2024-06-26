import {Template} from "./template";
import {EmailNotificationSubjects} from "../index";
import Handlebars from "handlebars";
import {CommentPushProps} from "../../services/push/types";

export class CommentTemplateCompiler extends Template {

  constructor() {
    super("server/templates/emails/");
  }

  compile(payload: CommentPushProps) {

    const title = `${payload.marketplace} @ BEPRO | ${EmailNotificationSubjects[payload.type]}`;

    const actionUrlEntryPart =
      payload.data.entryId
        ? (payload.type === "COMMENT_DELIVERABLE" ? `deliverable` : `proposal`).concat("/", payload.data.entryId, "/")
        : ""

    const actionUrlPart =
      `/${payload.marketplace}/task/${payload.data.taskId}/${actionUrlEntryPart}`;

    const type =
      payload.type === "COMMENT_DELIVERABLE"
        ? "deliverable"
        : payload.type === "COMMENT_PROPOSAL"
          ? "proposal"
          : "task"

    const templateData = {
      pageTitle: title,
      comment: payload.data.comment,
      type,
      actionHref: `https://app.bepro.network/${actionUrlPart}/?fromEmail=${payload.uuid}`
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("comments.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}