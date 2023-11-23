import { create } from "zustand";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

interface ActiveMarketplace {
  lastVisited: string | null;
  active: Network | null;
  currentChain: SupportedChainData | null;
  availableChains: SupportedChainData[] | null;
  transactionalTokens: Token[] | null;
  rewardTokens: Token[] | null;
}

type UseMarketplaceStore = {
  data: ActiveMarketplace,
  update: (data: Partial<ActiveMarketplace>) => ActiveMarketplace,
  updateLastVisited: (lastVisited: string) => ActiveMarketplace,
  updateActive: (active: Network) => ActiveMarketplace,
  updateCurrentChain: (currentChain: SupportedChainData) => ActiveMarketplace,
  updateAvailableChains: (availableChains: SupportedChainData[]) => ActiveMarketplace,
  updateTransactionalTokens: (transactionalTokens: Token[]) => ActiveMarketplace,
  updateRewardTokens: (rewardTokens: Token[]) => ActiveMarketplace,
  clear: () => void,
}

export const useMarketplaceStore = create<UseMarketplaceStore>((set, get) => {
  const cleanData = {
    lastVisited: null,
    active: null,
    currentChain: null,
    availableChains: null,
    transactionalTokens: null,
    rewardTokens: null
  };

  const update = (data: Partial<ActiveMarketplace>) => {
    const updated = Object.assign({}, get().data, data);
    set(() => ({
      data: updated
    }));
    return updated;
  };

  return {
    data: cleanData,
    update,
    updateLastVisited: (lastVisited: string) => update({ lastVisited }),
    updateActive: (active: Network) => update({ active }),
    updateCurrentChain: (currentChain: SupportedChainData) => update({ currentChain }),
    updateAvailableChains: (availableChains: SupportedChainData[]) => update({ availableChains }),
    updateTransactionalTokens: (transactionalTokens: Token[]) => update({ transactionalTokens }),
    updateRewardTokens: (rewardTokens: Token[]) => update({ rewardTokens }),
    clear: () => update(cleanData),
  }
});

