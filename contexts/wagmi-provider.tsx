import { ReactNode } from "react";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import getConfig from "next/config";
import { polygon } from "viem/chains";
import { WagmiProvider } from "wagmi";

import chainToWagmiChain from "helpers/chain-to-wagmi-chain";
import { QueryKeys } from "helpers/query-keys";

import { useGetChains } from "x-hooks/api/chain";
import useReactQuery from "x-hooks/use-react-query";

interface WagmiProps {
  children?: ReactNode;
}

const { publicRuntimeConfig } = getConfig();

export default function Wagmi ({
  children
}: WagmiProps) {
  const { data: supportedChains } =
    useReactQuery(QueryKeys.wagmiConfigChains(), () => useGetChains(), { staleTime: Infinity });

  const config = getDefaultConfig({
    appName: "BEPRO",
    projectId: publicRuntimeConfig?.walletConnectProjectId || "bc2288336095f20ebf8653a1ab670566",
    chains: [polygon, ...(supportedChains ? supportedChains.map(chainToWagmiChain) : [])],
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}