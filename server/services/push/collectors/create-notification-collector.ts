import {error} from "../../../../services/logging";
import {ErrorMessages} from "../../../errors/error-messages";
import {CreateNotification} from "../actors/create-notification";
import {Collector} from "../collector";
import {AnalyticEventName, AnalyticTypes, CollectEventPayload} from "../types";


export class CreateNotificationAction implements Collector<undefined, void[]> {
  readonly type = AnalyticTypes.CreateNotification;
  readonly collector: undefined;

  collect(events: CollectEventPayload[]): Promise<any> {

    const _collect = (event: CollectEventPayload) =>
      new CreateNotification(event.name as AnalyticEventName, event.params, event?.params?.target)
        .send()
        .catch(e => {
          error(ErrorMessages.FailedToCollectEmailNotification, e?.stack)
        })

    return Promise.allSettled(events.map(_collect))
  }
}