import { create } from "zustand";

import { ConnectedChain } from "interfaces/application-state";
import { SupportedChainData } from "interfaces/supported-chain-data";

type useSupportedChainStore = {
  chains: SupportedChainData[];
  connectedChain: ConnectedChain;
  isGetChainsDatabase: boolean;
  updateChains: (chains: SupportedChainData[]) => SupportedChainData[];
  updateConnectedChain: (chain: ConnectedChain) => ConnectedChain;
  loadChainsDatabase: () => void
};

export const useSupportedChainStore = create<useSupportedChainStore>((set, get) => ({
    chains: [],
    connectedChain: null,
    isGetChainsDatabase: false,
    updateChains: (chains: SupportedChainData[]) => {
      set(() => ({
        chains,
        isGetChainsDatabase: get().isGetChainsDatabase,
        connectedChain: get().connectedChain,
      }));
      return chains;
    },
    updateConnectedChain: (connectedChain: ConnectedChain) => {
      set(() => ({
        chains: get().chains,
        isGetChainsDatabase: get().isGetChainsDatabase,
        connectedChain,
      }));
      return connectedChain;
    },
    loadChainsDatabase: () => {
      set(() => ({
        chains: get().chains,
        isGetChainsDatabase: true,
        connectedChain: get().connectedChain,
      }));
    }
}));
