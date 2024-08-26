import {Template} from "./template";
import Handlebars from "handlebars";
import {CommentPushProps} from "../../services/push/types";

export class NotifCommentSubscriberTemplateCompiler extends Template {
  constructor() {
    super("server/templates/");
  }

  compile(payload: CommentPushProps) {
    const actionUrlEntryPart = payload.data.entryId ? `${payload.data.type}/${payload.data.entryId}/` : "";
    const actionUrlPart =
      `${payload.data.marketplace}/task/${payload.data.taskId}/${actionUrlEntryPart}`;

    const templateData = {
      comment: payload.data.comment,
      type: payload.data.type,
      taskTitle: payload.data.taskTitle,
      isTaskType: payload.data.type === "task",
      actionHref: `${actionUrlPart}/`,
      creator: payload.data.creator,
      marketplace: payload.data.marketplace,
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("notifs/comment-subscriber.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}