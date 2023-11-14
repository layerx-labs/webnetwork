import { create } from "zustand";

import { ConnectedChain } from "interfaces/application-state";
import { SupportedChainData } from "interfaces/supported-chain-data";

type useSupportedChainStore = {
  chains: SupportedChainData[];
  connectedChain: ConnectedChain;
  updateChains: (chains: SupportedChainData[]) => SupportedChainData[];
  updateConnectedChain: (chain: ConnectedChain) => ConnectedChain;
};

export const useSupportedChainStore = create<useSupportedChainStore>((set, get) => ({
    chains: [],
    connectedChain: null,
    updateChains: (chains: SupportedChainData[]) => {
      set(() => ({
        chains,
        connectedChain: get().connectedChain,
      }));
      return chains;
    },
    updateConnectedChain: (connectedChain: ConnectedChain) => {
      set(() => ({
        chains: get().chains,
        connectedChain,
      }));
      return connectedChain;
    },
}));
