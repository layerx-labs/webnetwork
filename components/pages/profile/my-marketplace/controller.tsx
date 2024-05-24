import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import MyNetworkPageView from "components/pages/profile/my-marketplace/view";

import { NetworkSettingsProvider, useNetworkSettings } from "contexts/network-settings";

import { lowerCaseCompare } from "helpers/string";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";

import { SearchBountiesPaginated } from "types/api";
import { MyMarketplacePageProps } from "types/pages";

import { useMarketplaceStore } from "x-hooks/stores/marketplace/use-marketplace.store";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";

interface MyMarketplaceProps {
  bounties: SearchBountiesPaginated;
  marketplaces: Network[];
}

export function MyMarketplace({
  bounties,
  marketplaces,
}: MyMarketplaceProps) {
  const [currentMarketplace, setCurrentMarketplace] = useState<Network>();
  const [selectedChain, setSelectedChain] = useState<SupportedChainData>();
  const [selectedMarketplace, setSelectedMarketplace] = useState<Network>();

  const { start } = useDao();
  const marketplace = useMarketplace();
  const { setForcedNetwork } = useNetworkSettings();
  const { update: updateMarketplaceStore } = useMarketplaceStore();

  const { networksObj, chainsObj } = marketplaces.reduce((acc, curr) => {
    const tmp = { ...acc };
    const selectedChainId = +selectedChain?.chainId;
    const selectedMarketplaceName = selectedMarketplace?.name;

    if (!selectedChainId || (!!selectedChainId && +curr.chain_id === selectedChainId))
      tmp.networksObj[curr.name] = curr;

    if (!selectedMarketplace || (!!selectedMarketplace && lowerCaseCompare(selectedMarketplaceName, curr.name)))
      tmp.chainsObj[curr.chain.chainShortName] = curr.chain;

    return tmp;
  }, { networksObj: {}, chainsObj: {} });

  const networks = Object.values(networksObj) as Network[];
  const chains = Object.values(chainsObj) as SupportedChainData[];

  function convertTimes (network: Network) {
    return {
      ...network,
      draftTime: +(network?.draftTime || 0) / 1000,
      disputableTime: +(network?.disputableTime || 0) / 1000,
      cancelableTime: +(network?.cancelableTime || 0) / 1000,
    }
  }
  
  function updateCurrentMarketplace(marketplace: Network, chain: SupportedChainData) {
    if (!marketplace || !chain)
      return;

    const marketplaceFound = 
      marketplaces.find(m => lowerCaseCompare(m.name, marketplace.name) && +m.chain_id === +chain.chainId);
    const marketplaceWithConvertedTimes = convertTimes(marketplaceFound);

    setCurrentMarketplace(marketplaceWithConvertedTimes);
    setForcedNetwork(marketplaceWithConvertedTimes);
    updateMarketplaceStore({
      active: marketplaceWithConvertedTimes
    });
    start({
      chainId: +marketplaceFound.chain_id,
      networkAddress: marketplaceFound.networkAddress
    }).catch(error => console.debug("start error", error));
  }

  const debouncedUpdateCurrentMarketplace= useDebouncedCallback((network: Network, chain: SupportedChainData) => {
    updateCurrentMarketplace(network, chain);
  }, 500);

  function onMarketplaceSelected (network: string | number) {
    marketplace.clear();
    setCurrentMarketplace(null);
    if (!network) {
      setSelectedMarketplace(null);
      return;
    }
    const selected = networks.find(n => lowerCaseCompare(n.name, network?.toString()));
    setSelectedMarketplace(selected);
    debouncedUpdateCurrentMarketplace(selected, selectedChain);
  }

  function onChainSelected (chain: string | number) {
    marketplace.clear();
    setCurrentMarketplace(null);
    if (!chain) {
      setSelectedChain(null);
      return;
    }
    const selected = chains.find(c => lowerCaseCompare(c.chainShortName, chain?.toString()));
    setSelectedChain(selected);
    debouncedUpdateCurrentMarketplace(selectedMarketplace, selected);
  }

  return(
    <MyNetworkPageView
      currentMarketplace={currentMarketplace}
      selectedNetwork={selectedMarketplace}
      selectedChain={selectedChain}
      chains={chains}
      networks={networks}
      bounties={bounties}
      onChainSelected={onChainSelected}
      onNetworkSelected={onMarketplaceSelected}
    />
  );
}

export default function MyMarketplacePage({
  bounties,
  marketplaces,
}: MyMarketplacePageProps) {
  return(
    <NetworkSettingsProvider>
      <MyMarketplace bounties={bounties} marketplaces={marketplaces} />
    </NetworkSettingsProvider>
  );
}