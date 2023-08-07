import { NextApiRequest, NextApiResponse } from "next";
import { WhereOptions } from "sequelize";

import models from "db/models";

import { isGovernorSigned } from "helpers/handleIsGovernor";

import { error as LogError } from "services/logging";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id } = req.query;

    if (type && !["issue", "deliverable", "proposal"].includes(type.toString().toLowerCase())) {
      return res.status(404).json({ message: "type does not exist" });
    }

    const isGovernor = await isGovernorSigned(req.headers);
    
    const filters: WhereOptions = {};

    if (!isGovernor) filters.hidden = false;
    if (type === "issue") filters.issueId = +id;
    if (type === "proposal") filters.proposalId = +id;
    if (type === "deliverable") filters.deliverableId = +id;

    let comments;

    if (type) {
      comments = await models.comments.findAll({
        where: {
          type: type,
          ...filters,
        },
      });
    } else {
      comments = await models.comments.findOne({
        where: {
          id: +id,
          ...filters,
        },
      });
    }

    if(!comments) return res.status(404).json({ message: 'comments not found'});

    return res.status(200).json(comments);
  } catch (error) {
    LogError(error);
    res.status(500).json(error);
  }
}
