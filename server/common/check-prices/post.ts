import { addMinutes } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import FillPriceTokensDatabase from "helpers/fill-price-tokens-database";

import { error as LogError } from "services/logging";

const CACHE_MINUTES = 5;

const {publicRuntimeConfig: {
  currency
}} = getConfig();

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tokens }: { tokens: { address: string; chainId: number }[] } = req.body;

    const NoPriceMessage = `No price for this token`

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
  
      if(!dbtoken) return res.status(404).json({ message: `token not found`})

      dbTokens.push(dbtoken)
    }

    const dataTokenPrice = dbtoken?.last_price_used?.updatedAt

    if(!dataTokenPrice || addMinutes(new Date(dataTokenPrice), CACHE_MINUTES) < new Date()){
      const priceDbTokens = await FillPriceTokensDatabase()
      const price = priceDbTokens.find(({ id }) => id === dbtoken.id)

      if(!price?.last_price_used[currency]) return res.status(404).json({ message: NoPriceMessage })

      return res.status(200).json(price.last_price_used);
    }

    if(!dbtoken?.last_price_used[currency]) return res.status(404).json({ message: NoPriceMessage })
        
    return res.status(200).json(dbtoken.last_price_used);

  } catch (error) {
    res.status(error?.status || 500).json(error?.message || error?.toString());
    LogError(error);
  }
}
