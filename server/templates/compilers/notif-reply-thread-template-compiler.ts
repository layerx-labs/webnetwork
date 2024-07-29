import Handlebars from "handlebars";

import { Template } from "server/templates/compilers/template";
import { ReplyThreadPushProps } from "server/services/push/types";

export class NotifReplyThreadTemplateCompiler extends Template {
  constructor() {
    super("server/templates/");
  }

  getActionHref(marketplace: string, taskId: string, deliverableId?: string, proposalId?: string) {
    let href = `${marketplace}/task/${taskId}`;

    if (deliverableId)
      href += `/deliverable/${deliverableId}/`;
    else if (proposalId)
      href += `/proposal/${proposalId}/`;

    return href;
  }

  compile(payload: ReplyThreadPushProps) {
    const {
      comment,
      creator,
      type,
      taskId,
      deliverableId,
      proposalId,
      marketplace,
    } = payload.data;

    const templateData = {
      comment: comment,
      actionHref: this.getActionHref(marketplace, taskId, deliverableId, proposalId),
      creator: creator,
      marketplace
    };

    const template = {
      creator: "reply-thread-creator.hbs",
      participant: "reply-thread-participant.hbs",
    }[type] || "comment.hbs";

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf(`notifs/${template}`))(templateData, {allowProtoPropertiesByDefault: true});
  }

}