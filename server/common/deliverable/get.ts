import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { getDeveloperAmount } from "helpers/calculateDistributedAmounts";

import { Logger } from "services/logging";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const include = [
      {
        association: "issue",
        required: true,
        include: [
          {
            association: "mergeProposals"
          },
          {
            association: "network",
            include: [{ association: "chain", attributes: ["chainShortName", "closeFeePercentage"] }],
          },
          {
            association: "transactionalToken"
          }
        ],
      },
      { association: "user" },
      { association: "comments" },
    ];

    const deliverable = await models.deliverable.findOne({
      where: {
        id: +id,
      },
      include,
    });

    const closeFee = deliverable.issue.network.chain.closeFeePercentage;

    deliverable.dataValues.issue.dataValues.developerAmount = 
      getDeveloperAmount( closeFee,
                          deliverable.issue.network.mergeCreatorFeeShare,
                          deliverable.issue.network.proposerFeeShare,
                          BigNumber(deliverable.issue.amount));

    return res.status(200).json(deliverable);
  } catch (error) {
    Logger.error(error, "deliverable endpoint error", req);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }
}
