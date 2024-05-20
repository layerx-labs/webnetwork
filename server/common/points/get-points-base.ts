import models from "db/models";

export async function getPointsBase() {
  const events = await models.pointsBase.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"]
    }
  });

  return events;
}