import { addMinutes } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import FillPriceTokensDatabase from "helpers/fill-price-tokens-database";

import { error as LogError } from "services/logging";
import { findTokenWithOldestUpdatedAt, handleResultTokens } from "helpers/handle-check-prices";

const CACHE_MINUTES = 5;

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tokens }: { tokens: { address: string; chainId: number }[] } = req.body;

    const missingValues = tokens
    .filter(({ chainId, address }) => !chainId || !address)
    .map(({ chainId }) => !chainId ? 'chainId' : 'token Address',);

    if(missingValues.length) return res.status(400).json({ message: `Missing parameters: ${missingValues.join(", ")}`})

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

    if(!dbTokens.length) return res.status(404).json({ message: `tokens not found` })

    const updatedAtisNull = dbTokens.filter((v) => !v?.last_price_used?.updatedAt)

    const oldestUpdatedAt = findTokenWithOldestUpdatedAt(dbTokens)?.last_price_used?.updatedAt
    
    if(updatedAtisNull.length || !oldestUpdatedAt || addMinutes(new Date(oldestUpdatedAt), CACHE_MINUTES) < new Date()){
      const priceDbTokens = await FillPriceTokensDatabase()
      
      const resultTokens = handleResultTokens(tokens, priceDbTokens)

      return res.status(200).json(resultTokens);
    }

    const resultTokens = handleResultTokens(tokens, dbTokens)
        
    return res.status(200).json(resultTokens);

  } catch (error) {
    res.status(error?.status || 500).json(error?.message || error?.toString());
    LogError(error);
  }
}
