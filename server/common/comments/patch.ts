import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { error as LogError } from "services/logging";

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { hidden } = req.body;

    const comments = await models.comments.findOne({
      where: {
        id: +id,
      },
    });

    if(!comments) return res.status(404).json({ message: 'comment not found'});

    comments.hidden = hidden;
    await comments.save();

    return res.status(200).json(comments);
  } catch (error) {
    LogError(error);
    res.status(500).json(error);
  }
}
