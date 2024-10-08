import {v4 as uuidv4} from "uuid";

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

    const {recipients} = await getEventTargets(this.payload, this.targets);

    for (const [, to] of recipients.filter(e => e).entries()) {
      const uuid = uuidv4();

      const marketplace = this.payload.data.marketplace?.toUpperCase();
      const taskTitle = this.payload.data.taskTitle;
      const subject = `${marketplace} @ BEPRO | ${EmailNotificationSubjects[this.templateName]} "${taskTitle}"`;

      const content =
        getTemplateCompiler({name: this.templateName as AnalyticEventName})
          ?.compile({...this.payload, template: this.templateName, uuid});

      if (!content)
        return;

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