import {NextApiRequest, NextApiResponse} from "next";
import {IncludeOptions, Op, Sequelize, WhereOptions} from "sequelize";

import models from "db/models";

import {HttpBadRequestError, HttpConflictError, HttpNotFoundError} from "server/errors/http-errors";
import {Push} from "server/services/push/push";
import {AnalyticEventName, AnalyticEvents} from "server/services/push/types";
import { subscribeUserToTask } from "server/utils/notifications/subscribe-user-to-task";

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

  const bounty = await models.issue.findOne({where: {id: issueId}, include: [{ association: "network" }]});

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

  const pushEvents: AnalyticEvents = [];
  await subscribeUserToTask(+issueId, user.id);

  if (replyId) {
    const repliedComment = await models.comments.findOne({
      where: {
        id: +replyId
      },
      include: [
        { 
          association: "user", 
          scope: "ownerOrGovernor",
          attributes: ["id", "email"]
        }
      ]
    });

    const replyEvent = (name, type, target) => ({
      name,
      params: {
        type: name,
        data: {
          comment,
          creator: user.address,
          taskId: issueId,
          deliverableId: deliverableId,
          proposalId: proposalId,
          marketplace: bounty.network.name,
          type
        },
        target
      }
    });

    if (repliedComment.userId !== user.id) {
      pushEvents.push(replyEvent(AnalyticEventName.REPLY_TO_THREAD_CREATOR, "creator", [repliedComment.user]));
      pushEvents.push(replyEvent(AnalyticEventName.NOTIF_REPLY_TO_THREAD_CREATOR, "creator", [repliedComment.user]));
    }

    const participants = await models.user.findAll({
      scope: "ownerOrGovernor",
      attributes: ["id", "email"],
      where: {
        id: {
          [Op.notIn]: [user.id, repliedComment.userId]
        }
      },
      include: [
        { 
          association: "comments",
          attributes: [],
          where: {
            replyId: +replyId,
          }
        }
      ]
    });

    if (participants.length) {
      pushEvents.push(replyEvent(AnalyticEventName.REPLY_TO_THREAD_PARTICIPANT, "participant", participants));
      pushEvents.push(replyEvent(AnalyticEventName.NOTIF_REPLY_TO_THREAD_PARTICIPANT, "participant", participants));
    }
  } else { 
    let event: AnalyticEventName;
    let origin;
  
    const include: IncludeOptions[] = [
      {
        association: "user",
        attributes: {
          include: ["email", "id"]
        },
        include: [{
          association: "settings"
        }]
      }, {
        association: "network"
      }
    ];

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
      include[0] = {
        ...include[0],
        on: Sequelize.where(Sequelize.fn("lower", Sequelize.col("creator")),
                            "=",
                            Sequelize.fn("lower", Sequelize.col("user.address")))
      }
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
      };

      pushEvents.push({name: event, params});
      pushEvents.push({name: "NOTIF_".concat(event) as any, params: {...params, type: "NOTIF_".concat(event) as any}});
    }
  }


  const subscribers = await models.user.findAll({
    attributes: ["id", "email"],
    where: {
      [Op.and]: [
        { email: { [Op.not]: null } },
        { email: { [Op.not]: "" } },
        { 
          id: { 
            [Op.notIn]: pushEvents.flatMap(event => event.params.target.map(target => target.id))
          } 
        },
        { id: { [Op.ne]: bounty.userId } }
      ]
    },
    include: [
      {
        association: "notificationSettings",
        required: true,
        attributes: [],
        where: {
          subscriptions: {
            [Op.contains]: [bounty.id]
          }
        },
      }
    ]
  });

  if (subscribers.length) {
    const data = {
      type: deliverableId && "deliverable" || proposalId && "proposal" || "task",
      entryId: deliverableId || proposalId,
      taskId: issueId,
      comment,
      madeBy: user.handle || user.address,
      creator: user.address,
      marketplace: bounty.network.name,
    };

    const params = {
      type: AnalyticEventName.SUBSCRIBER_COMMENT,
      target: subscribers,
      data
    };


    pushEvents.push({ name: AnalyticEventName.SUBSCRIBER_COMMENT, params });
    pushEvents.push({ 
      name: AnalyticEventName.NOTIF_SUBSCRIBER_COMMENT,
      params: {
        ...params,
        type: AnalyticEventName.NOTIF_SUBSCRIBER_COMMENT
      }
    });
  }

  if (pushEvents.length)
    Push.events(pushEvents);

  return comments;
}
