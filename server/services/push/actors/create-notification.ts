import {v4 as uuidv4} from "uuid";

import models from "../../../../db/models";
import {info} from "../../../../services/logging";
import {getTemplateCompiler} from "../../../templates/compilers/get-template-compiler";
import {getEventTargets} from "../../notifications/get-event-targets";
import {Templates} from "../../notifications/templates";
import {AnalyticEventName, CommentPushProps, EmailNotificationTargets, PushProps, ReplyThreadPushProps} from "../types";

export type CreateNotificationPayload = PushProps | CommentPushProps | ReplyThreadPushProps;

export class CreateNotification {
  constructor(readonly templateName: keyof typeof Templates,
              readonly payload: CreateNotificationPayload,
              readonly targets?: EmailNotificationTargets) {
  }

  async send() {
    const {recipients, ids} = await getEventTargets(this.payload, this.targets);

    for (const [index,] of recipients.filter(e => e).entries()) {
      const uuid = uuidv4();
      const userId = ids[index]

      const content =
        getTemplateCompiler({name: this.templateName as AnalyticEventName})
          ?.compile({...this.payload, template: this.templateName, uuid});

      if (!content)
        return;

      await models.notification.create({
        uuid, 
        type: "NOTIF_".concat(this.templateName),
        read: false, 
        userId, 
        template: content
      })
        .then(() => {
          info(`Created notification ${uuid} for ${userId}`)
        })
        .catch(e => {
          info(`Failed to create a notification: ${e?.toString()}`);
        })

    }
  }
}