import {toHex} from "web3-utils";

import { useAppState } from "contexts/app-state";
import { changeSpinners } from "contexts/reducers/change-spinners";

import {SupportedChainData} from "interfaces/supported-chain-data";

export default function useNetworkChange() {
  const { state, dispatch } = useAppState();
  
  async function handleAddNetwork(chosenSupportedChain: SupportedChainData = state.Service?.network?.active?.chain) {
    const chainId = toHex(chosenSupportedChain.chainId);

    dispatch(changeSpinners.update({ switchingChain: true }));

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: chainId,
          },
        ],
      })
      return true
    } catch (switchError) {
      if (switchError?.code === 4902 || switchError?.code === -32603) {
        try {
          await window.ethereum.request({
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
          })
        } catch (addError) {
          return addError
        }
      }
      return switchError
    } finally {
      dispatch(changeSpinners.update({ switchingChain: false }))
    }

  }

  return {
    handleAddNetwork
  };
}