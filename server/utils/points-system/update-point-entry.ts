import models from "db/models";

import { Logger } from "services/logging";

export async function updatePointEntryInfo(pointEntryId: number, info: object) {
  const pointEntry = await models.pointsEvents.findOne({
    where: {
      id: pointEntryId
    }
  });

  if (!pointEntry)
    throw new Error(`Entry with id ${pointEntryId} not found on points_events`);

  pointEntry.info = info;
  await pointEntry.save();

  Logger.info(`PointsEvents ${pointEntryId} updated with ${info}`);
}