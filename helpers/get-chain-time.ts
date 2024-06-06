import { Web3Connection } from "@taikai/dappkit";

export async function getChainTime(rpc: string): Promise<Date> {
  const connection = new Web3Connection({
    web3Host: rpc,
    skipWindowAssignment: true,
  });

  await connection.start();

  const latestBlock = await connection.Web3.eth.getBlock("latest");

  return new Date((latestBlock?.timestamp || 0) * 1000);
}