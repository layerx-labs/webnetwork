import { NextApiRequest, NextApiResponse } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import paginate from "helpers/paginate";

interface propsWhere {
  userId?: string | string[];
  issueId?: string | number;
}

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const { address, issueId, page, sortBy, order } = req.query;
  const where = {} as propsWhere;

  if (address) {
    const user = await models.user.findByAddress(address)

    if (user) {
      where.userId = user.id;
    }
  }

  if (issueId) {
    const issue = await models.issue.findOne({
      where: { id: issueId },
    });

    if (issue) {
      where.issueId = issue.id;
    }
  }

  const PAGE = +(page || 1);

  const deliverables = await models.deliverable.findAndCountAll(paginate({ 
    where, 
    include: [{ association: "issues" }] }, 
    { page: PAGE }, 
    [[sortBy || "updatedAt", order || "DESC"]]));

  return res.status(200).json(deliverables);
}
