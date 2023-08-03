import { NextApiRequest } from "next";
import { WhereOptions } from "sequelize";

import models from "db/models";

import { isGovernorSigned } from "helpers/handleIsGovernor";

export default async function get(req: NextApiRequest) {
  const { type, id } = req.query;

  const isGovernor = await isGovernorSigned(req.headers);

  const filters: WhereOptions = {};

  if(!isGovernor) filters.hidden = false;
  if (type === "issue") filters.issueId = +id;
  if (type === "proposal") filters.proposalId = +id;
  if (type === "deliverable") filters.deliverableId = +id;

  let comments;

  if (type) {
    comments = await models.comments.findAll({
      where: {
        type: type,
        ...filters
      },
    });
  } else {
    comments = await models.comments.findOne({
      where: {
        id: +id,
        ...filters
      },
    });
  }

  return comments;
}
