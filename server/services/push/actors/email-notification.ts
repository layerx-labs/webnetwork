import {format} from "node:util";
import {v4 as uuidv4} from "uuid";

import {EmailNotificationSubjects} from "../../../templates";
import {getTemplateCompiler} from "../../../templates/compilers/get-template-compiler";
import {emailService} from "../../email";
import {getEventTargets} from "../../notifications/get-event-targets";
import {Templates} from "../../notifications/templates";
import {AnalyticEventName} from "../types";

type EmailNotificationTarget = Pick<any, "email" | "id" | "user_settings">;
type EmailNotificationTargets = EmailNotificationTarget[];

export class EmailNotification<Payload = any> {
  constructor(readonly templateName: keyof typeof Templates,
              readonly payload: Payload,
              readonly targets?: EmailNotificationTargets) {
  }

  async send() {

    const {recipients,} = await getEventTargets(this.targets);

    for (const [,to] of recipients.filter(e => e).entries()) {
      const uuid = uuidv4();

      const subject =
        format(EmailNotificationSubjects[this.templateName], (this.payload as any)?.network?.name ?? "BEPRO");

      const content =
        getTemplateCompiler({name: this.templateName as AnalyticEventName})
          ?.compile({...this.payload, template: this.templateName, uuid});

      if (!content)
        return;

      await emailService.sendEmail(subject, to, content);
    }
  }
}