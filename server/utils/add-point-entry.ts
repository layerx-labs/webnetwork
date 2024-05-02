import {Op} from "sequelize";

import Database from "db/models";

type ActionName =
  "locked" |
  "delegated" |
  "created_marketplace" |
  "created_task" |
  "created_deliverable" |
  "created_proposal" |
  "accepted_proposal" |
  "add_github" |
  "add_linkedin";

export async function addPointEntry(userId: number, actionName: ActionName,) {

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

  return Database.pointsEvents.create({userId, actionName, pointsWon: event.pointsPerAction * event.scalingFactor,})
}