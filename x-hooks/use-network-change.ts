import {toHex} from "web3-utils";

import {SupportedChainData} from "interfaces/supported-chain-data";

import useMarketplace from "./use-marketplace";

export default function useNetworkChange() {
  const marketplace = useMarketplace();
  
  async function handleAddNetwork(chosenSupportedChain: SupportedChainData = marketplace?.active?.chain) {
    const chainId = toHex(chosenSupportedChain.chainId);

    return window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: chainId,
        },
      ],
    })
      .catch(error => {
        if ((error as any)?.message?.indexOf('addEthereumChain') > -1) {
          return window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainId,
                chainName: chosenSupportedChain.chainName,
                nativeCurrency: {
                  name: chosenSupportedChain.chainCurrencyName,
                  symbol: chosenSupportedChain.chainCurrencySymbol,
                  decimals: chosenSupportedChain.chainCurrencyDecimals,
                },
                rpcUrls: [chosenSupportedChain.chainRpc],
                blockExplorerUrls: [chosenSupportedChain.blockScanner],
              },
            ],
          }).catch(e => {
            throw new Error(e);
          })
        }

        throw new Error(error);
      })
  }

  return {
    handleAddNetwork
  };
}