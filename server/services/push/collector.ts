import {AnalyticTypes, CollectEventPayload} from "./types";

export abstract class Collector<CollectorInstance = any, Collected = any> {
  abstract readonly type: AnalyticTypes;
  abstract readonly collector: CollectorInstance;

  public abstract collect(events: CollectEventPayload[]): Promise<Collected>;
}