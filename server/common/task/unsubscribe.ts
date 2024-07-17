import { NextApiRequest } from "next";

import models from "db/models";

import { HttpNotFoundError } from "server/errors/http-errors";

export async function unsubscribeOfTask(req: NextApiRequest) {
  const { id } = req.query;
  const { context: { user } } = req.body;

  const task = await models.issues.findOne({
    where: {
      id: +id
    }
  });

  if (!task)
    throw new HttpNotFoundError("Task not found");

  const notificationSettings = await models.notificationSettings.findOne({
    where: {
      userId: user.id
    }
  });

  if (!notificationSettings)
    throw new Error("Missing notification settings");

  if (notificationSettings.subscriptions.include(id)) {
    notificationSettings.subscriptions = notificationSettings.subscriptions.filter(taskId => taskId !== +id);

    await notificationSettings.save();
  }
}