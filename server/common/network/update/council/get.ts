import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { error as LogError } from "services/logging";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { networkId } = req.query;

    const network = await models.network.findOne({
      where: {
        id: +networkId,
      },
      include: [{ association: "curators" }]
    });

    if(!network) return res.status(404).json({ message: 'Network not found' })

    if(!network?.councilAmount) return res.status(404).json({ message: 'Curator amount not found' })

    const councilAmount = BigNumber(network.councilAmount)

    const curators = network.curators || []

    for (const curator of curators) {
      const allTokensLocked = BigNumber(curator.tokensLocked).plus(BigNumber(curator.delegatedToMe));
      const isCurator = allTokensLocked.gte(councilAmount);

      curator.isCurrentlyCurator = isCurator;
      await curator.save();
    }

    return res.status(200).json('Council updated data');
  } catch (error) {
    res.status(500).json(error);
    LogError(error);
  }
}
