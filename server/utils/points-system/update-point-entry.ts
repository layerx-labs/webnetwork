import models from "db/models";

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
}