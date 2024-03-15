import {NextApiRequest, NextApiResponse} from "next";
import {WhereOptions} from "sequelize";

import models from "db/models";

import {error as LogError} from "services/logging";

import {HttpBadRequestError, HttpConflictError, HttpNotFoundError} from "../../errors/http-errors";

export default async function post(req: NextApiRequest, res: NextApiResponse) {

  const {
    comment,
    issueId,
    deliverableId,
    proposalId,
    type: originalType,
    replyId,
    context
  } = req.body;

  const type = originalType.toLowerCase();

  const isValidNumber = (v) => /^\d+$/.test(v);

  const foundOrValid = (v) => v ? 'found' : 'valid';

  if (!["issue", "deliverable", "proposal", "review"].includes(type))
    throw new HttpBadRequestError("type does not exist")


  if (!issueId || !isValidNumber(issueId))
    throw new HttpNotFoundError(`issueId not ${foundOrValid(!issueId)}`);

  if ((["deliverable", "review"].includes(type)) && (!deliverableId || !isValidNumber(deliverableId)))
    throw new HttpNotFoundError(`deliverableId not ${foundOrValid(!deliverableId)}`)

  if (type === "proposal" && (!proposalId || !isValidNumber(proposalId)))
    throw new HttpNotFoundError(`proposalId not ${foundOrValid(!proposalId)}`)


  const user = context.user;

  if (!user)
    throw new HttpNotFoundError("user not found");

  const bounty = await models.issue.findOne({where: {id: issueId}})

  if (!bounty)
    throw new HttpNotFoundError("task not found");

  if (bounty.isClosed && ["deliverable", "review", "proposal"].includes(type))
    throw new HttpConflictError("task is already closed")

  const whereCondition: WhereOptions = {};

  if (deliverableId && ["deliverable", "review"].includes(type)) {
    const curator = await models.curator.findByAddressAndNetworkId(user.address, bounty.network_id);

    if (!curator || !curator?.isCurrentlyCurator) return res.status(403).json({message: `user is not a curator`});
    whereCondition.deliverableId = +deliverableId;
  }

  if (proposalId && type === "proposal")
    whereCondition.proposalId = +proposalId;

  const comments = await models.comments.create({
    issueId: +issueId,
    comment,
    type,
    userAddress: user.address,
    userId: user.id,
    hidden: false,
    ...(deliverableId || proposalId ? whereCondition : null),
    ...(replyId ? {replyId: +replyId} : null),
  });

  return comments

}
