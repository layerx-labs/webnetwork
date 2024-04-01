import NetworkRegistry from "@taikai/dappkit/dist/build/contracts/NetworkRegistry.json";
import getConfig from "next/config";

import { ChainCastService } from "server/services/chain-cast";

const { serverRuntimeConfig } = getConfig();

function getBase64Program(type: "registry" | "network") {
  return  Buffer.from(JSON.stringify([{
    "name": "bullmq-producer",
    "args": {
      "bodyInput": "event",
      "queueName": `${serverRuntimeConfig?.environmentName}_${type}_queue`,
      "indexName": "txin",
      "redisHost": serverRuntimeConfig?.chainCast?.redisHost,
      "redisPort": serverRuntimeConfig?.chainCast?.redisPort
    }
  }])).toString("base64");
}

export async function addToChainCast( type: "registry" | "network", 
                                      address: string, 
                                      chainId: number, 
                                      startBlock: number) {
  const abi = {
    registry: JSON.stringify(NetworkRegistry.abi)
  }[type];

  const base64Abi = Buffer.from(abi).toString("base64");
  const base64Program = getBase64Program(type);

  return ChainCastService.addContractCast({
    abi: base64Abi,
    address,
    chainId: +chainId,
    program: base64Program,
    type: "CUSTOM",
    startFrom: +startBlock,
  });
}