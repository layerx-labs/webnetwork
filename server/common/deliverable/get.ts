import BigNumber from "bignumber.js";
import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {getDeveloperAmount} from "helpers/calculateDistributedAmounts";

import {BadRequestErrors} from "interfaces/enums/Errors";

import {HttpBadRequestError, HttpNotFoundError} from "server/errors/http-errors";

export default async function get(req: NextApiRequest, res: NextApiResponse) {

  const {id} = req.query;

  if (!id || isNaN(+id))
    throw new HttpBadRequestError(BadRequestErrors.WrongParameters)

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
          include: [
            {
              association: "chain",
              attributes: ["chainId", "icon", "chainShortName", "closeFeePercentage"]
            }
          ],
        },
        {
          association: "transactionalToken"
        }
      ],
    },
    { association: "user" },
    {
      association: "comments",
      include: [
        { 
          association: "user",
          attributes: ["address", "handle", "avatar"]
        },
        { 
          association: "replies",
          include: [
            { 
              association: "user",
              attributes: ["address", "handle", "avatar"]
            }
          ]
        }
      ]
    },
  ];

  const deliverable = await models.deliverable.findOne({
    where: {
      id: +id,
    },
    include,
  });

  if (!deliverable)
    throw new HttpNotFoundError("no deliverable found");

  const closeFee = deliverable.issue.network.chain.closeFeePercentage;

  deliverable.dataValues.issue.dataValues.developerAmount =
    getDeveloperAmount(closeFee,
                       deliverable.issue.network.mergeCreatorFeeShare,
                       deliverable.issue.network.proposerFeeShare,
                       BigNumber(deliverable.issue.amount));

  return deliverable;

}
