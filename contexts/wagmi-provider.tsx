import { ReactNode } from "react";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import getConfig from "next/config";
import { polygon } from "viem/chains";
import { WagmiProvider } from "wagmi";

import chainToWagmiChain from "helpers/chain-to-wagmi-chain";

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
    useReactQuery(["wagmi-config-chains"], () => useGetChains(), { staleTime: Infinity });

  const config = getDefaultConfig({
    appName: "BEPRO",
    projectId: publicRuntimeConfig?.walletConnectProjectId,
    chains: [polygon, ...(supportedChains ? supportedChains.map(chainToWagmiChain) : [])],
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}