import models from "db/models";

import { PointsBase } from "interfaces/points-system";

export async function get(): Promise<PointsBase[]> {
  const pointsBase = await models.pointsBase.findAll();

  return pointsBase;
}