import { create } from "zustand";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

interface ActiveMarketplace {
  lastVisited: string | null;
  active: Network | null;
  availableChains: SupportedChainData[] | null;
  transactionalTokens: Token[] | null;
  rewardTokens: Token[] | null;
}

type UseMarketplaceStore = {
  data: ActiveMarketplace,
  update: (data: Partial<ActiveMarketplace>) => ActiveMarketplace,
  updateLastVisited: (lastVisited: string) => ActiveMarketplace,
  updateActive: (active: Network) => ActiveMarketplace,
  updateParamsOfActive: (network: Network) => ActiveMarketplace,
  updateAvailableChains: (availableChains: SupportedChainData[]) => ActiveMarketplace,
  updateTransactionalTokens: (transactionalTokens: Token[]) => ActiveMarketplace,
  updateRewardTokens: (rewardTokens: Token[]) => ActiveMarketplace,
  clear: () => void,
}

export const useMarketplaceStore = create<UseMarketplaceStore>((set, get) => {
  const cleanData = {
    lastVisited: null,
    active: null,
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
    updateParamsOfActive: (network: Network) => update({
      active: {
        ...network,
        name: get().data?.active?.name,
        description: get().data?.active?.description,
        colors: get().data?.active?.colors,
        logoIcon: get().data?.active?.logoIcon,
        fullLogo: get().data?.active?.fullLogo,
      }
    }),
    updateAvailableChains: (availableChains: SupportedChainData[]) => update({ availableChains }),
    updateTransactionalTokens: (transactionalTokens: Token[]) => update({ transactionalTokens }),
    updateRewardTokens: (rewardTokens: Token[]) => update({ rewardTokens }),
    clear: () => update(cleanData),
  }
});

