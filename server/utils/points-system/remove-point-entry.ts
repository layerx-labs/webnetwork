import models from "db/models";

import {Logger} from "services/logging";

export async function removePointEntry(pointEntryId: number) {
  const pointEntry = await models.pointsEvents.findOne({
    where: {
      id: pointEntryId
    }
  });

  if (!pointEntry)
    throw new Error(`Entry with id ${pointEntryId} not found on points_events`);

  if (pointEntry.pointsCounted) {
    const user = await models.user.findOne({
      where: {
        id: pointEntry.userId
      }
    });

    user.totalPoints = user.totalPoints - pointEntry.pointsWon;

    await user.save();
  }

  await pointEntry.destroy();

  Logger.info(`PointsEvents ${pointEntryId} removed ${pointEntry.pointsCounted ? "and user totalPoints updated" : ""}`);
}