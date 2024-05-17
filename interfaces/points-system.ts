import { BaseModel } from "interfaces/db/base";

export interface PointsBase extends BaseModel {
  actionName: string;
  pointsPerAction: number;
  scalingFactor: number;
  counter: string;
}