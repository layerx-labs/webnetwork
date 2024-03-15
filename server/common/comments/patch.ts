import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {HttpBadRequestError, HttpNotFoundError} from "../../errors/http-errors";

export default async function patch(req: NextApiRequest, res: NextApiResponse) {

  const {id} = req.query;
  const {hidden} = req.body;

  const comments = await models.comments.findOne({
    where: {
      id: +id,
    },
  });

  if (!comments)
    throw new HttpNotFoundError("comment not found")

  if ([true, false, "true", "false"].includes(hidden)) {
    comments.hidden = hidden;
    await comments.save();

    return comments;
  } else
    throw new HttpBadRequestError("hidden field is not valid")

}
