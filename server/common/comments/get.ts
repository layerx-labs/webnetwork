import {NextApiRequest} from "next";
import {Op, Order, WhereOptions} from "sequelize";

import models from "db/models";

import {isGovernorSigned} from "helpers/handleIsGovernor";

import {HttpBadRequestError, HttpConflictError} from "server/errors/http-errors";

export default async function get(req: NextApiRequest) {

  const {issueId, proposalId, deliverableId, userId, type, id} = req.query;

  const isGovernor = await isGovernorSigned(req.headers);

  if (type && !["issue", "deliverable", "proposal", "review"].includes(type?.toString()))
    throw new HttpConflictError("type already exists")

  const filters: WhereOptions = {
    replyId: {
      [Op. is]: null
    }
  };

  if (!isGovernor) filters.hidden = false;
  if (issueId) filters.issueId = +issueId;
  if (proposalId) filters.proposalId = +proposalId;
  if (deliverableId) filters.deliverableId = +deliverableId;
  if (userId) filters.userId = +userId;
  if (type) filters.type = type;

  let comments;

  const include = [
    {
      association: "user",
      attributes: ["handle", "avatar", "address"]
    },
    { 
      association: "replies",
      include: [
        {
          association: "user",
          attributes: ["handle", "avatar", "address"]
        }
      ]
    }
  ];

  const order: Order = [
    ["createdAt", "ASC"]
  ];

  if ((issueId || proposalId || deliverableId || userId || type) && !id) {
    /* When we only ask for deliverableId || proposalId || issueid,
    this route fetches all comments related to that id, regardless of type */
    comments = await models.comments.findAll({
      where: {
        ...filters,
      },
      include,
      order
    });
  } else {
    comments = await models.comments.findOne({
      where: {
        id: +id,
        ...filters,
      },
      include,
      order
    });
  }

  if (!comments)
    throw new HttpBadRequestError("comments not found")

  return comments;
}
