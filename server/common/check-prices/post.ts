import {addMinutes} from "date-fns";
import {NextApiRequest} from "next";
import {Op, Sequelize} from "sequelize";

import models from "db/models";

import FillPriceTokensDatabase from "helpers/fill-price-tokens-database";
import {findTokenWithOldestUpdatedAt, handleResultTokens} from "helpers/handle-check-prices";

import {HttpBadRequestError, HttpNotFoundError} from "server/errors/http-errors";

const CACHE_MINUTES = 5;

export default async function post(req: NextApiRequest) {
  const { tokens }: { tokens: { address: string; chainId: number }[] } = req.body;

  const missingValues = tokens
  .filter(({ chainId, address }) => !chainId || !address)
  .map(({ chainId }) => !chainId ? 'chainId' : 'token Address',);

  if(missingValues.length)
    throw new HttpBadRequestError(`Missing parameters: ${missingValues.join(", ")}`);

  const dbTokens = []

  const _chainTokens: {[c: string]: string[]} = {};
  for (const {chainId, address} of tokens)
    _chainTokens[chainId.toString()] =
      [... (_chainTokens[chainId.toString()] || []), address];

  for (const [, addresses] of Object.entries(_chainTokens))
    dbTokens.push(... (await models.tokens.findAll({
        // raw: true,
        where: {
          [Op.or]: [
            Sequelize.where(Sequelize.fn('lower', Sequelize.col('address')), { [Op.in]: addresses.map(address => address.toLowerCase()) }),
            { address: { [Op.in]: addresses } }
          ]
        },
    })) || [])

  if(!dbTokens.length)
    throw new HttpNotFoundError(`tokens not found`);

  const updatedAtisNull = dbTokens.filter((v) => !v?.last_price_used?.updatedAt)

  const oldestUpdatedAt = findTokenWithOldestUpdatedAt(dbTokens)?.last_price_used?.updatedAt

  if(updatedAtisNull.length || !oldestUpdatedAt || addMinutes(new Date(oldestUpdatedAt), CACHE_MINUTES) < new Date()){
    const priceDbTokens = await FillPriceTokensDatabase(dbTokens);

    return handleResultTokens(tokens, priceDbTokens);
  }



  return handleResultTokens(tokens, dbTokens.map(token => token.toJSON()));
}
