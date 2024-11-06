import {ReactNode} from "react";

import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import getConfig from "next/config";
import {parseCookies} from "nookies";
import {defineChain} from "viem";
import {aurora, auroraTestnet, mainnet, moonbeam, polygon, polygonAmoy, polygonMumbai, localhost} from "viem/chains";
import {cookieStorage, cookieToInitialState, createStorage, WagmiProvider} from "wagmi";

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

const ganache = defineChain({
  ...localhost,
  blockExplorers: {
    default: {
      name: "Local",
      url: "http://127.0.0.1:8545",
    }
  }
});

const config = getDefaultConfig({
    appName: "BEPRO",
    projectId: publicRuntimeConfig?.walletConnectProjectId || "bc2288336095f20ebf8653a1ab670566",
    chains: [
      polygon,
      aurora,
      moonbeam,
      coinEx,
      mainnet,
      polygonAmoy,
      polygonMumbai,
      auroraTestnet,
      ... (publicRuntimeConfig?.isProduction ? [] : [
        ganache,
      ])
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