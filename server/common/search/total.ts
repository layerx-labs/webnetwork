import {ParsedUrlQuery} from "querystring";
import {Op, WhereOptions} from "sequelize";

import models from "../../../db/models";
import {getAssociation} from "../../../helpers/db/models";
import {HttpNotFoundError} from "../../errors/http-errors";

export default async function getTotalUsers(query?: ParsedUrlQuery) {
  const whereCondition: WhereOptions = {state: {[Op.notIn]: ["pending", "canceled"]}, visible: true};
  const {
    state,
    issueId,
    address,
    networkName,
  } = query || {};

  if (state) whereCondition.state = state;

  if (issueId) whereCondition.id = issueId;

  const networks = await models.network.findAll({
    where: {
      isRegistered: true,
      isClosed: false,
      ...networkName ? {
        name: {[Op.iLike]: String(networkName)}
      } : {}
    }
  })

  if (networks.length === 0)
    throw new HttpNotFoundError("Networks not found")

  whereCondition.network_id = {[Op.in]: networks.map(network => network.id)};

  const userAssociation =
    !address
      ? null
      : getAssociation("user", undefined, !!address, {
        where: {
          address: {
            [Op.iLike]: `%${address.toString()}%`
          }
        }
      });

  const issueCount = await models.issue.count({
    where: whereCondition,
    include: userAssociation ? [userAssociation] : []
  });

  return issueCount;
}