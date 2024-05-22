export interface PointsBase {
  id: number;
  actionName: string;
  pointsPerAction: number;
  scalingFactor: number;
  counter: string;
}

export interface PointsEvents {
  id: number;
  userId: number;
  actionName: string;
  pointsWon: number;
  pointsCounted: boolean;
  info: object;
}