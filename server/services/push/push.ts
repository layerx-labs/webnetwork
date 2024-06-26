import {error} from "../../../services/logging";
import {ErrorMessages} from "../../errors/error-messages";
import {Collector} from "./collector";
import {getCollector} from "./get-collector";
import {AnalyticEventName, AnalyticEvents, AnalyticsEvents, CommentPushProps, PushProps} from "./types";

export class Push {

  static getCollectors(name: AnalyticEventName) {
    return (name in AnalyticsEvents) ? (AnalyticsEvents[name] || []).map(getCollector) : [];
  }

  static async event<T = CommentPushProps|any>(name: AnalyticEventName, params: PushProps<T>) {
    return Push.events([{name, params}]);
  }

  static async events(payload: AnalyticEvents) {

    const collectedEvents: { [k in AnalyticEventName]?: { collector: Collector, events: AnalyticEvents } } = {};

    try {
      for (const event of payload) {
        const collectors = Push.getCollectors(event.name);
        for (const collector of collectors) {
          if (collector?.type)
            collectedEvents[collector.type] =
            {
                ...(collectedEvents[collector.type] || {}),
                collector,
                events: [...(collectedEvents[collector.type]?.events || []), event]
            }
        }
      }

      await Promise.allSettled(Object.values(collectedEvents)
          .map(({collector, events}) =>
            collector.collect(JSON.parse(JSON.stringify(events)))))
    } catch (e) {
      error(ErrorMessages.FailedToCollectLog, e?.toString());
    }
  }
}