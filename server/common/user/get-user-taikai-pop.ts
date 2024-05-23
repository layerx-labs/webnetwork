import cache from "memory-cache";
import {NextApiRequest} from "next";
import getConfig from "next/config";

import {FIVE_MINUTES_IN_MS} from "../../../helpers/constants";

const {serverRuntimeConfig: {ankrKey}} = getConfig()

export async function getUserTaikaiPop(req: NextApiRequest) {

  const walletAddress = req.query.address;

  const cacheKey = `taikai-pops-${walletAddress}`
  const cachedValue = cache.get(cacheKey);
  if (cachedValue)
    return Promise.resolve(cachedValue);

  const url = `https://rpc.ankr.com/multichain/${ankrKey}`;
  const headers = {'Content-Type': 'application/json'};

  const crawl = async (pageToken = "", assets = []) => {
    const body = {
      jsonrpc: '2.0',
      method: 'ankr_getNFTsByOwner',
      params: {
        blockchain: "polygon",
        walletAddress,
        pageToken,
        pageSize: 2,
        filter: [{'0x115cc61A1980295e43f813AdEc68769c50057088': []},]
      },
      id: 1
    };

    const value = await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(body)}).then(r => r.json());

    console.log(`VALUE.result.nextPageToken`, value.result.nextPageToken)
    console.log(`VALUE.result.assets`, value.result.assets)

    if (value.result.nextPageToken)
      return crawl(value.result.nextPageToken, [...assets, ...(value.result.assets||[])])

    return [...assets, ...value.result.assets];
  }

  const value = await crawl();

  cache.put(cacheKey, value, FIVE_MINUTES_IN_MS);

  return value;

}