import {NextApiRequest} from "next";

import models from "db/models";

export async function getEventsOfUser(req: NextApiRequest) {
  const { context } = req.body;

  const userId = context?.user?.id;

  const events = await models.pointsEvents.findAll({
    attributes: {
      exclude: ["info", "updatedAt"]
    },
    order:[["createdAt", "DESC"]],
    where: {
      userId: +userId
    },
    include: [
      { 
        association: "pointsBase",
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      }
    ]
  });

  return events;
}