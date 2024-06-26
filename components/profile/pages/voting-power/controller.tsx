import { useEffect, useState } from "react";

import { useRouter } from "next/router";
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
  const { query } = useRouter();

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

  const findNetwork = (name: string) => networks?.find(n => lowerCaseCompare(n.name, name));
  const findChain = (chainShortName: string) => 
    supportedChains?.find(c => lowerCaseCompare(c.chainShortName, chainShortName));

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
    const selected = findNetwork(network?.toString());
    setSelectedNetwork(selected);
    debouncedHandleService(selected, selectedChain);
  }

  function onChainSelected (chain: string | number) {
    marketplace.clear();
    if (!chain) {
      setSelectedChain(null);
      return;
    }
    const selected = findChain(chain?.toString());
    setSelectedChain(selected);
    debouncedHandleService(selectedNetwork, selected);
  }

  function loadFromQuery(networkName: string, networkChain: string) {
    const network = findNetwork(networkName?.toString());
    const chain = findChain(networkChain?.toString());
    if (!network || !chain)
      return;
    setSelectedChain(chain);
    setSelectedNetwork(network);
    debouncedHandleService(network, chain);
  }

  useEffect(() => {
    loadChainsDatabase();
  }, []);

  useEffect(() => {
    if (!query?.networkName || !query?.networkChain || !!selectedChain || !!selectedNetwork)
      return;
    loadFromQuery(query?.networkName.toString(), query?.networkChain.toString());
  }, [query]);

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
