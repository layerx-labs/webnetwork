import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { resJsonMessage } from "helpers/res-json-message";

import { UserRoleUtils } from "server/utils/jwt";

import {HttpConflictError} from "../../errors/http-errors";

export default async function del(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const { context } = req.body;

  const isGovernor = UserRoleUtils.hasGovernorRole(context.token);

  const deliverable = await models.deliverable.findOne({
    where: {
      id: id,
      ... isGovernor ? {} : {userId: context.user.id}
    },
  });

  if (!deliverable)
    throw new HttpConflictError("Invalid")

  if (deliverable.prContractId)
    throw new HttpConflictError("This deliverable already exists in the contract")

  await deliverable.destroy();

  return {message: "Deliverable Canceled"};
}
