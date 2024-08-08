import {Template} from "./template";
import {EmailNotificationSubjects} from "../index";
import Handlebars from "handlebars";
import {CommentPushProps} from "../../services/push/types";
import getConfig from "next/config";

const { publicRuntimeconfig } = getConfig();

export class EmailCommentSubscriberTemplateCompiler extends Template {
  constructor() {
    super("server/templates/");
  }

  compile(payload: CommentPushProps) {
    const title = `${payload.data.marketplace} @ BEPRO | ${EmailNotificationSubjects[payload.type]}`;

    const actionUrlEntryPart = payload.data.entryId ? `${payload.data.type}/${payload.data.entryId}/` : "";
    const actionUrlPart =
      `${payload.data.marketplace}/task/${payload.data.taskId}/${actionUrlEntryPart}`;

    const templateData = {
      pageTitle: title,
      comment: payload.data.comment,
      type: payload.data.type,
      isTaskType: payload.data.type === "task",
      actionHref: `${publicRuntimeconfig.urls.home}/${actionUrlPart}/?fromEmail=${payload.uuid}`,
      commentCreator: payload.data.creator,
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("emails/comment-subscriber.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}