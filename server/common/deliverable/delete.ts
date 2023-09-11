import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { resJsonMessage } from "helpers/res-json-message";

export default async function del(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const { context } = req.body;

  const user = await models.user.findByAddress(context.token.address)

  if (!user) return res.status(404).json({ message: "user not found" });

  const deliverable = await models.deliverable.findOne({
    where: {
      id: id,
      userId: user.id
    },
  });

  if (!deliverable) return resJsonMessage("Invalid", res, 404);

  if (deliverable.prContractId)
    return resJsonMessage("This deliverable already exists in the contract",
                          res,
                          409);

  await deliverable.destroy();

  return res.status(200).json("Deliverable Canceled");
}
