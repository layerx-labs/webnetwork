import NetworkRegistry from "@taikai/dappkit/dist/build/contracts/NetworkRegistry.json";

import { ChainCastService } from "server/services/chain-cast";

export async function addToChainCast( type: "registry" | "network", 
                                      address: string, 
                                      chainId: number, 
                                      startBlock: number) {
  const abi = {
    registry: JSON.stringify(NetworkRegistry.abi)
  }[type];

  const base64Abi = Buffer.from(abi).toString("base64");

  return ChainCastService.addContractCast({
    abi: base64Abi,
    address,
    chainId: +chainId,
    program: "W3sibmFtZSI6IndlYmhvb2siLCJhcmdzIjp7InVybCI6Imh0dHBzOi8vd2ViaG9vay5zaXRlLzEwOGZiMDFkLTVjM2MtNDg0Mi1iMjk2LTY2YzQzYmEyMmFmMCIsImJvZHlJbnB1dCI6ImV2ZW50In19XQ",
    type: "CUSTOM",
    startFrom: +startBlock,
  });
}