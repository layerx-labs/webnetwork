import { NextApiRequest } from "next";
import { Op } from "sequelize";

import models from "db/models";

import { HttpBadRequestError } from "server/errors/http-errors";

const isValidNumberParam = param => param > 0 && !isNaN(param);
const isValidCounter = param => param === "N" || +param >= 0 && !isNaN(+param);

export async function put(req: NextApiRequest) {
  const { rows } = req.body;

  rows.forEach(({ id , scalingFactor, pointsPerAction, counter }) => {
    if (!id || (!scalingFactor && !pointsPerAction && !counter))
      throw new HttpBadRequestError(`Missing paramaters for ${id}`);
  
    if (!!scalingFactor && !isValidNumberParam(+scalingFactor) || 
        !!pointsPerAction && !isValidNumberParam(+pointsPerAction) ||
        !!counter && isValidCounter(counter))
      throw new HttpBadRequestError(`Invalid paramaters for ${id}`);
  });

  for (const row of rows) {
    const { id , scalingFactor, pointsPerAction, counter } = row;
    const toUpdate = {};

    if (scalingFactor)
      toUpdate["scalingFactor"] = scalingFactor;

    if (pointsPerAction)
      toUpdate["pointsPerAction"] = pointsPerAction;

    if (counter)
      toUpdate["counter"] = counter;

    await models.pointsBase.update(toUpdate, {
      where: {
        id
      }
    });
  }
}