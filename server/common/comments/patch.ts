import { NextApiRequest } from "next";

import models from "db/models";

export default async function path(req: NextApiRequest) {
  const { id } = req.query;
  const { hidden } = req.body;

  const comments = await models.comments.findOne({
    where: {
      id: +id
    }
  });

  comments.hidden = hidden
  await comments.save();

  return comments;
}
