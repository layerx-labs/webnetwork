import { NextApiRequest, NextApiResponse } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import paginate from "helpers/paginate";
import { resJsonMessage } from "helpers/res-json-message";

interface propsWhere {
  userId?: string | string[];
  issueId?: string | number;
}

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const { address, issueId } = req.query;
  const where = {} as propsWhere;

  if (address) {
    const user = await models.user.findOne({
      where: {
        address: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("address")),
                                 "=",
                                 address),
      },
    });

    if (!user) return res.status(404).json({ message: "user not found" });

    where.userId = user.id;
  }

  if (issueId) {
    const issue = await models.issue.findOne({
      where: { id: issueId },
    });

    if (!issue) return resJsonMessage("Issue not found", res, 404);

    where.issueId = issue.id;
  }

  const deliverables = await models.deliverable.findAndCountAll({
    ...paginate({ where, include: [{ association: "issues" }] }, req.query, [
      [req.query.sortBy || "updatedAt", req.query.order || "DESC"],
    ]),
  });

  return res.status(200).json(deliverables);
}
