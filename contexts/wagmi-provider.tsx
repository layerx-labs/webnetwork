import { ReactNode } from "react";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import getConfig from "next/config";
import { parseCookies } from "nookies";
import { defineChain } from "viem";
import { aurora, auroraTestnet, mainnet, moonbeam, polygon, polygonMumbai } from "viem/chains";
import { WagmiProvider, cookieStorage, createStorage, cookieToInitialState } from "wagmi";

interface WagmiProps {
  children?: ReactNode;
}

const { publicRuntimeConfig } = getConfig();

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

const statingChain = defineChain({
  id: publicRuntimeConfig?.defaultChain?.id,
  name: publicRuntimeConfig?.defaultChain?.name,
  nativeCurrency: { 
    name: publicRuntimeConfig?.defaultChain?.nativeToken, 
    symbol: publicRuntimeConfig?.defaultChain?.nativeToken, 
    decimals: publicRuntimeConfig?.defaultChain?.decimals
  },
  rpcUrls: {
    default: {
      http: [publicRuntimeConfig?.defaultChain?.rpc],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: publicRuntimeConfig?.defaultChain?.blockscan,
    },
  }
});

const isProduction = publicRuntimeConfig?.isProduction;
const testnets = [auroraTestnet, statingChain];

const config = getDefaultConfig({
    appName: "BEPRO",
    projectId: publicRuntimeConfig?.walletConnectProjectId || "bc2288336095f20ebf8653a1ab670566",
    chains: [
      polygon,
      polygonMumbai,
      aurora,
      moonbeam,
      coinEx,
      mainnet,
      ...(isProduction ? [] : testnets)
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
});

export default function Wagmi ({
  children
}: WagmiProps) {
  const cookies = parseCookies();
  const initialState = cookieToInitialState(config, JSON.stringify(cookies));

  return (
    <WagmiProvider config={config} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
}