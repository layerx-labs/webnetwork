import {NextApiRequest, NextApiResponse} from "next";
import {Sequelize, WhereOptions} from "sequelize";

import Database from "db/models";

import {withCORS} from "middleware";

const colToLower = (colName: string) => Sequelize.fn("LOWER", Sequelize.col(colName));

async function get(req: NextApiRequest, res: NextApiResponse) {
  const {networkName, chainId, chainShortName, type} = req.query;


  const whereCondition: WhereOptions = {};
  const networkWhere: WhereOptions = {};
  const chainWhere: WhereOptions = {};

  if (type === "transactional")
    whereCondition.isTransactional = true;

  if (type === "reward")
    whereCondition.isReward = true;

  if (networkName) {
    whereCondition.isAllowed = true;
    networkWhere.name = Sequelize.where(colToLower("networks.name"), "=", (networkName as string)?.toLowerCase());
  }

  if (chainId)
    chainWhere.chainId = +chainId;

  if (chainShortName)
    chainWhere.chainShortName = chainShortName;

  return Database.tokens.findAll({
    where: whereCondition,
    include: [
      {
        association: "networks",
        required: !!networkName,
        where: networkWhere
      }, {
        association: "chain",
        required: !!chainId || !!chainShortName,
        where: chainWhere
      }
    ]
  });

}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req, res));
    break;

  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
}

export default withCORS(handler);
