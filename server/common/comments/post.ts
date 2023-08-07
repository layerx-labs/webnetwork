import { NextApiRequest, NextApiResponse } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import { error as LogError } from "services/logging";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const headerWallet = (req.headers.wallet as string).toLowerCase();

    const { comment, issueId, deliverableId, proposalId, type, replyId } =
      req.body;

    if (!["issue", "deliverable", "proposal"].includes(type.toLowerCase())) {
      return res.status(404).json({ message: "type does not exist" });
    }

    const user = await models.user.findOne({
      where: {
        address: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("address")),
                                 "=",
                                 headerWallet),
      },
    });

    if (!user) return res.status(404).json({ message: "user not found" });

    let idType = {};

    if (deliverableId) idType = { deliverableId: +deliverableId };
    if (proposalId) idType = { proposalId: +proposalId };

    const comments = await models.comments.create({
      issueId: +issueId,
      comment,
      type: type.toLowerCase(),
      userAddress: headerWallet,
      userId: user.id,
      hidden: false,
      ...(deliverableId || proposalId ? idType : null),
      ...(replyId ? { replyId: +replyId } : null),
    });

    return res.status(200).json(comments);
    
  } catch (error) {
    LogError(error);
    res.status(500).json(error);
  }
}
