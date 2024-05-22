import {Op} from "sequelize";

import Database from "db/models";

import {Logger} from "services/logging";

import {PointEventAction} from "../../../types/point-event-action";

export async function addPointEntry(userId: number, actionName: PointEventAction, info = {}) {

  const whereActionName =
    {actionName: {[Op.eq]: actionName}}

  const event =
    await Database.pointsBase.findOne({where: whereActionName});

  if (!event)
    throw new Error(`PointsBase actionName: ${actionName} not found`);

  if (event.counter === "0")
    throw new Error(`PointsBase ${actionName} is disabled`);

  const pastEvents =
    await Database.pointsEvents
      .findAll({where: { ...whereActionName, userId: {[Op.eq]: userId} }})

  if (event.counter !== "N" && pastEvents.length >= +event.counter)
    throw new Error(`PointsBase ${actionName} limit (${+event.counter}) for ${userId} has been reached`);

  const pointsWon = event.pointsPerAction * event.scalingFactor;

  await Database.pointsEvents.create({userId, actionName, pointsWon, info});

  Logger.info(`PointsBase ${actionName} entry created for ${userId} with ${pointsWon} points`);
}