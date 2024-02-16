import dotenv from "dotenv";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, aurora, moonbeam,  auroraTestnet, polygonMumbai } from "viem/chains";
import { defineChain } from "viem";

import { getEnvironmentName } from "helpers/get-environment-name";

dotenv.config();

const coinEx = defineChain({
  id: 52,
  name: 'CoinEx',
  nativeCurrency: { name: 'CoinEx Chain Native Token', symbol: 'CET', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.coinex.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CoinEx Smart Chain Explorer',
      url: 'https://www.coinex.net/',
    },
  }
});

const environment = getEnvironmentName();
const chainsByEnvironment = {
  production: [polygon, aurora, moonbeam, coinEx],
  staging: [polygonMumbai],
  development: [auroraTestnet, polygonMumbai],
};

export const rainbowKitConfig = getDefaultConfig({
  appName: 'BEPRO Network',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: chainsByEnvironment[environment] || [],
  ssr: true,
});