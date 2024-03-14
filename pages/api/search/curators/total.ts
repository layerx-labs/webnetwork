import BigNumber from "bignumber.js";
import {NextApiRequest, NextApiResponse} from "next";
import {Op, Sequelize, WhereOptions} from "sequelize";

import models from "db/models";

import {resJsonMessage} from "helpers/res-json-message";

import {withCORS} from "middleware";
import {WithValidChainId} from "middleware/with-valid-chain-id";

import {HttpNotFoundError} from "../../../../server/errors/http-errors";

const castToDecimal = (col: string) => Sequelize.cast(Sequelize.col(col), "decimal");
const sqlzLower = (col, value) => Sequelize.where(Sequelize.fn("lower", Sequelize.col(col)), value.toLowerCase());

async function get(req: NextApiRequest, res: NextApiResponse) {

  const {networkName, chainShortName} = req.query || {};

  const where: WhereOptions = {};

  if (networkName || chainShortName) {
    const networks = await models.network.findAll({
      where: {
        ...networkName ? {name: sqlzLower("name", networkName.toString())} : {},
      },
      ...chainShortName ? {
        include: [
          {
            association: "chain",
            required: true,
            where: {
              chainShortName: sqlzLower("chainShortName", chainShortName.toString())
            }
          }
        ]
      } : {}
    });

    if (!networks.length)
      throw new HttpNotFoundError("no results")

    where.networkId = {
      [Op.in]: networks.map(({id}) => id)
    };
  }

  const [curators] = await models.curator.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("curator.id")), "totalCurators"],
      [
        Sequelize.literal(`SUM(CASE WHEN "curator"."isCurrentlyCurator" = true THEN 1 ELSE 0 END)`),
        "totalActiveCurators"
      ],
      [Sequelize.fn("SUM", castToDecimal("tokensLocked")), "totalLocked"],
      [Sequelize.fn("SUM", castToDecimal("delegatedToMe")), "totalDelegated"],
    ],
    where,
    raw: true
  });

  return {
    ...curators,
    totalValue: BigNumber(curators.totalLocked || 0).plus(curators.totalDelegated || 0).toFixed()
  };

}

async function TotalCurators(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req, res));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(WithValidChainId(TotalCurators));
