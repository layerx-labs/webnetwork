import {NextApiRequest, NextApiResponse} from "next";
import {Op, WhereOptions} from "sequelize";

import models from "db/models";

import {HttpBadRequestError, HttpConflictError, HttpNotFoundError} from "../../errors/http-errors";
import {Push} from "../../services/push/push";
import {AnalyticEventName} from "../../services/push/types";

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

  let event: AnalyticEventName;
  let origin;

  const include = [{
    association: "user",
    attributes: {
      include: ["email", "id"]
    },
    include: [{
      association: "settings"
    }]
  }, "network"]

  if (type === "deliverable" || type === "review") {
    include[1] = {
      association: "issue",
      include: [
        {association: "network"}
      ]
    } as any;
    event = AnalyticEventName.COMMENT_DELIVERABLE;
    origin = await models.deliverable.findOne({where: {id: {[Op.eq]: deliverableId}}, include});
  } else if (type === "proposal") {
    event = AnalyticEventName.COMMENT_PROPOSAL;
    origin = (await models.mergeProposal.findOne({where: {id: {[Op.eq]: proposalId}}, include}))
  } else {
    event = AnalyticEventName.COMMENT_TASK;
    origin = (await models.issue.findOne({where: {id: {[Op.eq]: +issueId}}, include}))
  }

  if (origin?.user.id !== user.id) {
    const target = [origin?.user];
    const marketplace = origin?.network?.name || origin?.issue?.network?.name;

    const data = {
      entryId: deliverableId || proposalId,
      taskId: issueId,
      comment,
      madeBy: user.handle || user.address,
      creator: user.address,
      marketplace,
    };

    const params = {
      type: event,
      target,
      data
    }

    Push.events([
      {name: event, params},
      {name: "NOTIF_".concat(event) as any, params: {...params, type: "NOTIF_".concat(event) as any}},
    ])
  }

  return comments

}
