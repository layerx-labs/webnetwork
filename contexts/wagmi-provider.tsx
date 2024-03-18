import { ReactNode } from "react";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import getConfig from "next/config";
import { parseCookies } from "nookies";
import { defineChain } from "viem";
import { aurora, auroraTestnet, mainnet, moonbeam, polygon, polygonMumbai } from "viem/chains";
import { WagmiProvider, createStorage, cookieToInitialState, parseCookie } from "wagmi";

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

const cookieStorage = {
  getItem(key) {
    if (typeof window === 'undefined') return null
    const value = parseCookie(document.cookie, key)
    return value ?? null
  },
  setItem(key, value) {
    if (typeof window === 'undefined') return
    document.cookie = `${key}=${value};Path=/`
  },
  removeItem(key) {
    if (typeof window === 'undefined') return
    document.cookie = `${key}=;max-age=-1`
  },
}

export default function Wagmi ({
  children
}: WagmiProps) {
  const config = getDefaultConfig({
    appName: "BEPRO",
    projectId: publicRuntimeConfig?.walletConnectProjectId || "bc2288336095f20ebf8653a1ab670566",
    chains: [polygon, polygonMumbai, aurora, auroraTestnet, moonbeam, coinEx, mainnet],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    })
  });

  const cookies = parseCookies();
  const initialState = cookieToInitialState(config, JSON.stringify(cookies));

  return (
    <WagmiProvider config={config} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
}