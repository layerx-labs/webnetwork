import {error, warn} from "../../../services/logging";
import {ErrorMessages} from "../../errors/error-messages";
import {Collector} from "./collector";
import {SendGridEmailNotification} from "./collectors/sendgrid-email-notification";
import {Analytic, AnalyticTypes} from "./types";

export function getCollector({type}: Analytic): Collector | null {
  try {
    switch (type) {
    case AnalyticTypes.EmailNotification:
      return new SendGridEmailNotification();
    default:
      warn(ErrorMessages.CollectorUnknown, {type});
      return null;
    }
  } catch (e) {
    error(`Failed to return collector ${type}`, e?.toString());
    return null;
  }
}