import {v4 as uuidv4} from "uuid";

import models from "db/models";

import {error, info} from "../../../services/logging";
import {EmailTemplate} from "../../templates/email-template";
import {getEventTargets} from "./get-event-targets";


export class Notification {
  static async create(type: string, payload: any) {

    const {ids,} = await getEventTargets(payload?.targets);
    const template =
      new EmailTemplate().compile({type, payload});

    for (const userId of ids) {
      const uuid = uuidv4();
      await models.notifications.create({uuid, type, read: false, userId, template})
        .then(_ => {
          info(`Notification created ${type}, ${uuid}, userId: ${userId}`);
        })
        .catch(e => {
          error(`Failed to create notification ${type}, ${uuid}, userId: ${userId}`, e?.toString());
        })
    }
  }
}