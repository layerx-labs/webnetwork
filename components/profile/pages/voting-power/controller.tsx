import {useState} from "react";

import VotingPowerPageView from "components/profile/pages/voting-power/view";

import {lowerCaseCompare} from "helpers/string";

import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";

import {useMarketplaceStore} from "x-hooks/stores/marketplace/use-marketplace.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function VotingPowerPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [selectedChain, setSelectedChain] = useState<SupportedChainData>();

  const { start } = useDao();
  const marketplace = useMarketplace();
  const { update } = useMarketplaceStore();
  const { currentUser } = useUserStore();
  const { supportedChains } = useSupportedChain();

  const networks = Object.values(Object.fromEntries(supportedChains?.flatMap(c => c.networks).map(n => [n.name, n])));
  const isNoNetworkTokenModalVisible = !!marketplace?.active && !marketplace?.active?.networkToken &&
    lowerCaseCompare(currentUser?.walletAddress, marketplace?.active?.creatorAddress);

  function onNetworkSelected (network: string | number) {
    if (!network) {
      setSelectedNetwork(null);
      return;
    }

    setSelectedNetwork(networks?.find(n => lowerCaseCompare(n.name, network?.toString())));
  }

  function onChainSelected (chain: string | number) {
    if (!chain) {
      setSelectedChain(null);
      return;
    }

    setSelectedChain(supportedChains?.find(c => lowerCaseCompare(c.chainShortName, chain?.toString())));
  }

  function handleMarketplaceChange(marketplace: Network) {
    if (!marketplace) return;
    update({
      active: marketplace
    });
    start({
      chainId: +marketplace?.chain_id,
      networkAddress: marketplace?.networkAddress
    });
  }

  return (
    <VotingPowerPageView
      selectedNetwork={selectedNetwork}
      selectedChain={selectedChain}
      chains={supportedChains}
      networks={networks}
      isNoNetworkTokenModalVisible={isNoNetworkTokenModalVisible}
      onNetworkSelected={onNetworkSelected}
      onChainSelected={onChainSelected}
    />
  );
}
