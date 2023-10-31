import { create } from "zustand";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

interface ActiveMarketplace {
  lastVisited: string | null;
  active: Network | null;
  noDefaultNetwork: boolean | null;
  availableChains: SupportedChainData[] | null;
  transactionalTokens: Token[] | null;
  rewardTokens: Token[] | null;
}

type UseMarketplaceStore = {
  data: ActiveMarketplace,
  update: (data: Partial<ActiveMarketplace>) => ActiveMarketplace,
  updateLastVisited: (lastVisited: string) => ActiveMarketplace,
  updateActive: (active: Network) => ActiveMarketplace,
  updateNoDefaultNetwork: (noDefaultNetwork: boolean) => ActiveMarketplace,
  updateAvailableChains: (availableChains: SupportedChainData[]) => ActiveMarketplace,
  updateTransactionalTokens: (transactionalTokens: Token[]) => ActiveMarketplace,
  updateRewardTokens: (rewardTokens: Token[]) => ActiveMarketplace,
}

export const useMarketplaceStore = create<UseMarketplaceStore>((set, get) => {
  const update = (data: Partial<ActiveMarketplace>) => {
    const updated = Object.assign({}, get().data, data);
    set(() => ({
      data: updated
    }));
    return updated;
  };

  return {
    data: {
      lastVisited: null,
      active: null,
      noDefaultNetwork: null,
      availableChains: null,
      transactionalTokens: null,
      rewardTokens: null
    },
    update,
    updateLastVisited: (lastVisited: string) => update({ lastVisited }),
    updateActive: (active: Network) => update({ active }),
    updateNoDefaultNetwork: (noDefaultNetwork: boolean) => update({ noDefaultNetwork }),
    updateAvailableChains: (availableChains: SupportedChainData[]) => update({ availableChains }),
    updateTransactionalTokens: (transactionalTokens: Token[]) => update({ transactionalTokens }),
    updateRewardTokens: (rewardTokens: Token[]) => update({ rewardTokens }),
  }
});

