import { NextApiRequest } from "next";

import models from "db/models";

import { HttpBadRequestError } from "server/errors/http-errors";

const isValidNumberParam = param => param > 0 && !isNaN(param);
const isValidCounter = param => param === "N" || +param >= 0 && !isNaN(+param);
const isEmpty = value => value === null || value === undefined;

export async function put(req: NextApiRequest) {
  const { rows } = req.body;

  if (!rows?.length)
    throw new HttpBadRequestError("Missing rows to update");

  rows.forEach(({ id, actionName, scalingFactor, pointsPerAction, counter }) => {
    if (!id || (isEmpty(scalingFactor) && isEmpty(pointsPerAction) && isEmpty(counter)))
      throw new HttpBadRequestError(`Missing paramaters for ${actionName || id}`);

    if (!isEmpty(scalingFactor) && !isValidNumberParam(+scalingFactor) || 
        !isEmpty(pointsPerAction) && !isValidNumberParam(+pointsPerAction) ||
        !isEmpty(counter) && !isValidCounter(counter))
      throw new HttpBadRequestError(`Invalid paramaters for ${actionName || id}`);
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