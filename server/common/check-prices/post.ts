import { addMinutes } from "date-fns";
import { NextApiRequest } from "next";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import FillPriceTokensDatabase from "helpers/fill-price-tokens-database";
import { findTokenWithOldestUpdatedAt, handleResultTokens } from "helpers/handle-check-prices";

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
  for (const token of tokens) {
    const dbtoken = await models.tokens.findOne({
      where: {
        chain_id: token.chainId,
        address: caseInsensitiveEqual('address', token.address)
      }
    })
    if(dbtoken) dbTokens.push(dbtoken)
  }

  if(!dbTokens.length)
    throw new HttpNotFoundError(`tokens not found`);

  const updatedAtisNull = dbTokens.filter((v) => !v?.last_price_used?.updatedAt)

  const oldestUpdatedAt = findTokenWithOldestUpdatedAt(dbTokens)?.last_price_used?.updatedAt

  if(updatedAtisNull.length || !oldestUpdatedAt || addMinutes(new Date(oldestUpdatedAt), CACHE_MINUTES) < new Date()){
    const priceDbTokens = await FillPriceTokensDatabase();

    return handleResultTokens(tokens, priceDbTokens);
  }

  return handleResultTokens(tokens, dbTokens);
}
