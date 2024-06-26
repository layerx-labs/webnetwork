import {v4 as uuidv4} from "uuid";

import models from "../../../../db/models";
import {info} from "../../../../services/logging";
import {EmailNotificationSubjects} from "../../../templates";
import {getTemplateCompiler} from "../../../templates/compilers/get-template-compiler";
import {emailService} from "../../email";
import {getEventTargets} from "../../notifications/get-event-targets";
import {Templates} from "../../notifications/templates";
import {AnalyticEventName, CommentPushProps, EmailNotificationTargets, PushProps} from "../types";


export class EmailNotification {
  constructor(readonly templateName: keyof typeof Templates,
              readonly payload: PushProps|CommentPushProps,
              readonly targets?: EmailNotificationTargets) {
  }

  async send() {

    const {recipients, ids} = await getEventTargets(this.targets);

    console.log(`RECIPIENTS`, recipients);

    for (const [index, to] of recipients.filter(e => e).entries()) {
      const userId = ids[index];
      const uuid = uuidv4();

      const subject = `${this.payload.marketplace} @ BEPRO | ${EmailNotificationSubjects[this.payload.type]}`;

      const content =
        getTemplateCompiler({name: this.templateName as AnalyticEventName})
          ?.compile({...this.payload, template: this.templateName, uuid});

      if (!content)
        return;

      await models.notifications.create({uuid, type: "NOTIF_".concat(this.templateName), read: false, userId, template: content})
        .then(() => {
          info(`Created notification ${uuid} for ${userId}`)
        })
        .catch(e => {
          info(`Failed to create a notification: ${e?.toString()}`);
        })

      await emailService.sendEmail(subject, to, content)
        .then(() => {
          info(`Sent email to ${to} of type ${this.templateName}`);
        })
        .catch(e => {
          info(`Failed to send email notification: ${e?.toString()}`);
        });
    }
  }
}