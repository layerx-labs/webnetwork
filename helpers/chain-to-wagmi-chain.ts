import { defineChain } from "viem";

import { SupportedChainData } from "interfaces/supported-chain-data";

export default function chainToWagmiChain (chain: SupportedChainData) {
  if (!chain) return null;
  return defineChain({
    id: chain.chainId,
    name: chain.chainName,
    nativeCurrency: {
      name: chain.chainCurrencyName,
      symbol: chain.chainCurrencySymbol,
      decimals: +chain.chainCurrencyDecimals
    },
    rpcUrls: {
      default: {
        http: [chain.chainRpc],
      },
    },
    blockExplorers: {
      default: {
        name: `${chain.chainName} Explorer`,
        url: chain.blockScanner,
      },
    }
  });
}