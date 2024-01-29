import { useEffect, useState } from "react";

import {useDebouncedCallback} from "use-debounce";

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
  const { currentUser } = useUserStore();
  const { update } = useMarketplaceStore();
  const { supportedChains, loadChainsDatabase } = useSupportedChain();

  const networks =
    Object.values(Object.fromEntries(supportedChains?.
    filter(c => +c?.chainId === +selectedChain?.chainId || !selectedChain)?.
    flatMap(c => c?.networks).map(n => [n?.name, n])));
  const chains =
    supportedChains?.filter(c => c?.networks?.find(n => lowerCaseCompare(n?.name, selectedNetwork?.name)) ||
      !selectedNetwork);
  const isNoNetworkTokenModalVisible = !!marketplace?.active && !marketplace?.active?.network_token_id &&
    lowerCaseCompare(currentUser?.walletAddress, marketplace?.active?.creatorAddress);

  function handleService (network: Network, chain: SupportedChainData) {
    if (!network || !chain)
      return;
    const networkOnChain =
      supportedChains?.find(c => +c?.chainId === +chain?.chainId)?.networks?.find(n => n.name === network?.name);
    if (!networkOnChain)
      return;
    update({
      active: networkOnChain
    });
    start({
      chainId: +chain?.chainId,
      networkAddress: networkOnChain?.networkAddress
    });
  }

  const debouncedHandleService = useDebouncedCallback((network: Network, chain: SupportedChainData) => {
    handleService(network, chain);
  }, 1000);

  function onNetworkSelected (network: string | number) {
    marketplace.clear();
    if (!network) {
      setSelectedNetwork(null);
      return;
    }
    const selected = networks?.find(n => lowerCaseCompare(n.name, network?.toString()));
    setSelectedNetwork(selected);
    debouncedHandleService(selected, selectedChain);
  }

  function onChainSelected (chain: string | number) {
    marketplace.clear();
    if (!chain) {
      setSelectedChain(null);
      return;
    }
    const selected = supportedChains?.find(c => lowerCaseCompare(c.chainShortName, chain?.toString()))
    setSelectedChain(selected);
    debouncedHandleService(selectedNetwork, selected);
  }

  useEffect(() => {
    loadChainsDatabase();
  }, []);

  return (
    <VotingPowerPageView
      selectedNetwork={selectedNetwork}
      selectedChain={selectedChain}
      chains={chains}
      networks={networks}
      isNoNetworkTokenModalVisible={isNoNetworkTokenModalVisible}
      onNetworkSelected={onNetworkSelected}
      onChainSelected={onChainSelected}
    />
  );
}
