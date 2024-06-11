import models from "db/models";

export async function getPointsBase() {
  const events = await models.pointsBase.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"]
    },
    order: ["actionName"]
  });

  return events;
}