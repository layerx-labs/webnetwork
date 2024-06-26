import { NextApiHandler } from "next";

import models from "db/models";

import { NOT_AN_CREATOR_ISSUE, MISSING_CHAIN_ID } from "helpers/constants";
import { verifySiweSignature } from "helpers/siwe";

export const withIssue = (handler: NextApiHandler, methods: string[] = [ `PUT` ]) => {
  return async (req, res) => {
    if (!methods.includes(req.method.toUpperCase()))
      return handler(req, res);

    const {
        ids: [id, networkName, chainName],
      } = req.query;

    const headers = req.headers;
    const chainId = (headers.chain as string);

    const network = await models.network.findOneByNetworkAndChainNames(networkName, chainName);
  
    if (!network) 
      return res.status(401).json({message:"Invalid network"});
  
    const issue = await models.issue.findOne({
      where: {
        id: +id,
        network_id: network?.id
      },
      include: [
        { association: "user" }
      ]
    });
  
    if (!issue) 
      return res.status(401).json({message: "bounty not found"});

    if (!chainId)
      return res.status(401).json({ message: MISSING_CHAIN_ID });

    const signature = req.body?.context?.token?.signature?.toString();
    const nonce = req.body?.context?.token?.nonce?.toString();
    const siweMessage = req.body?.context?.siweMessage;

    if (!(await verifySiweSignature(siweMessage, signature, nonce)))
      return res.status(401).json({ message: NOT_AN_CREATOR_ISSUE });

    return handler(req, res);
  }
}