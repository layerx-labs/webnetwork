import { NextApiRequest } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

export default async function post(req: NextApiRequest) {
  const headerWallet = (req.headers.wallet as string).toLowerCase();

  const { comment, issueId, deliverableId, proposalId, type, replyId } =
    req.body;

  const user = await models.user.findOne({
    where: {
      address: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("address")),
                               "=",
                               headerWallet),
    },
  });


  let idType = {};

  if (deliverableId) idType = { deliverableId: +deliverableId };
  if (proposalId) idType = { proposalId: +proposalId };

  const comments = await models.comments.create({
    issueId: +issueId,
    comment,
    type,
    userAddress: headerWallet,
    userId: user.id,
    hidden: false,
    ... (deliverableId || proposalId) ? idType : null,
    ... replyId ? { replyId: +replyId } : null,
  });

  return comments;
}
