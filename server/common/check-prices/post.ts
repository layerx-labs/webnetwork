import { NextApiRequest, NextApiResponse } from "next";
import { WhereOptions } from "sequelize";

import models from "db/models";

import { error as LogError } from "services/logging";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      tokenAddress,
      chainId
    } = req.body;

    return res.status(200).json([]);
  } catch (error) {
    res.status(500).json(error);
    LogError(error)
  }
}
