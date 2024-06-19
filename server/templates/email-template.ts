import {format} from "node:util";
import Handlebars from "handlebars";
import {Template} from "./compilers/template";
import {EmailNotificationSubjects} from "./index";

export class EmailTemplate extends Template {

  constructor() {
    super("server/templates/emails/");
  }

  compile(payload: any) {

    const title = format(EmailNotificationSubjects[payload.template], payload?.network?.name ?? "BEPRO");

    const templateData = {
      pageTitle: title,
      notificationTitleHeading: title,
      taskTitleParagraph: payload.title,
      actionHref: `https://app.bepro.network/${payload?.network?.name ?? "BEPRO"}/task/${payload.bountyId}/?fromEmail=${payload.uuid}`
    };

    super.registerPartials();

    return Handlebars.compile(this.getHtmlOf("base-template.hbs"))(templateData, {allowProtoPropertiesByDefault: true});
  }

}