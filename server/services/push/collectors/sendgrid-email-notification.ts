import {error} from "../../../../services/logging";
import {ErrorMessages} from "../../../errors/error-messages";
import {EmailNotification} from "../actors/email-notification";
import {Collector} from "../collector";
import {AnalyticEventName, AnalyticTypes, CollectEventPayload} from "../types";


export class SendGridEmailNotification implements Collector<undefined, ClientResponse[]> {
  readonly type = AnalyticTypes.EmailNotification;
  readonly collector: undefined;

  collect(events: CollectEventPayload[]): Promise<any> {

    const _collect = (event: CollectEventPayload) =>
      new EmailNotification(event.name as AnalyticEventName, event.params, event?.params?.target)
        .send()
        .catch(e => {
          error(ErrorMessages.FailedToCollectEmailNotification, e?.stack)
        })

    return Promise.allSettled(events.map(_collect))
  }
}