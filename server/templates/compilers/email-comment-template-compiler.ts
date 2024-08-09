import {Template} from "./template";
import {EmailNotificationSubjects} from "../index";
import Handlebars from "handlebars";
import {CommentPushProps} from "../../services/push/types";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export class EmailCommentTemplateCompiler extends Template {

  constructor() {
    super("server/templates/");
  }

  compile(payload: CommentPushProps) {

    const title = `${payload.data.marketplace} @ BEPRO | ${EmailNotificationSubjects[payload.type]}`;

    const actionUrlEntryPart =
      payload.data.entryId
        ? (payload.type === "COMMENT_DELIVERABLE" ? `deliverable` : `proposal`).concat("/", payload.data.entryId, "/")
        : ""

    const actionUrlPart =
      `/${payload.data.marketplace}/task/${payload.data.taskId}/${actionUrlEntryPart}`;

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
      actionHref: `${publicRuntimeConfig.urls.home}/${actionUrlPart}/?fromEmail=${payload.uuid}`
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("emails/comment.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}