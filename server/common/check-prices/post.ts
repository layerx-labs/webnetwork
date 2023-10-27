import { addMinutes } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import FillPriceTokensDatabase from "helpers/fill-price-tokens-database";

import { error as LogError } from "services/logging";

const CACHE_MINUTES = 5;

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tokenAddress, chainId } = req.body;

    const missingValues = [
      [chainId, "chainId"],
      [tokenAddress, "Token Address"]
    ]
      .filter(([value]) => !value)
      .map(([,error]) => error);

    if(missingValues.length) return res.status(400).json({ message: `Missing parameters: ${missingValues.join(", ")}`})

    const dbtoken = await models.tokens.findOne({
      where: {
        chain_id: chainId,
        address: caseInsensitiveEqual('address', tokenAddress)
      }
    })

    if(!dbtoken) return res.status(404).json({ message: `token not found`})

    if(addMinutes(new Date(dbtoken?.last_price_used?.updatedAt), CACHE_MINUTES) < new Date()){
      const priceDbTokens = await FillPriceTokensDatabase()
      const price = priceDbTokens.find(({ id }) => id === dbtoken.id)

      if(!price?.last_price_used) return res.status(404).json({ message: `no price for this token` })

      return res.status(200).json(price.last_price_used);
    }
        
    return res.status(200).json(dbtoken.last_price_used);

  } catch (error) {
    res.status(500).json(error);
    LogError(error);
  }
}
