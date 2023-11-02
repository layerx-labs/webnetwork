import axios from "axios";

export const COINGECKO_API = axios.create({baseURL: "https://api.coingecko.com/api/v3"});

//Get the icon based on the block chain network and contract address
export async function getCoinIconByChainAndContractAddress(address: string, chainId: number): Promise<string | null> {
  const platforms = await COINGECKO_API.get(`/asset_platforms`).then((value) => value.data);

  const platformByChainId = platforms.find(({chain_identifier}) => chain_identifier === chainId)

  if (!platformByChainId) return null;

  const coin = await COINGECKO_API.get(`/coins/${platformByChainId.id}/contract/${address}`).then((value) => value.data);

  if(!coin) return null;
  
  return coin?.image?.thumb
}