import {BigNumber} from "bignumber.js";
import {NextApiRequest} from "next";
import {Op} from "sequelize";

import models from "../../../db/models";
import {getDeveloperAmount} from "../../../helpers/calculateDistributedAmounts";
import {HttpForbiddenError} from "../../errors/http-errors";

export async function listSubscriptions(req: NextApiRequest) {
  const {context: {user}} = req.body;

  if (!user?.id)
    throw new HttpForbiddenError("no user id");

  const subscribed = (await models.notificationSettings.findOne({
    where: {
      userId: user.id
    },
    attributes: ["subscriptions"]
  }))?.subscriptions;

  if (!subscribed || !subscribed?.length)
    return [];

  return await models.issue.findAll({
    where: {
      id: {
        [Op.in]: (subscribed as number[]).reverse(),
      }
    },
    include: [{model: models.network, include: [{model: models.chain, as: "chain"}]}]
  }).then(result =>
    result.map(issue => {
      const {
        network: {chain: {closeFeePercentage}, mergeCreatorFeeShare, proposerFeeShare},
        amount
      } = issue;
      issue.dataValues.developerAmount =
        getDeveloperAmount(closeFeePercentage || 0, mergeCreatorFeeShare || 0, proposerFeeShare || 0, BigNumber(amount))

      return issue;
    }));
}