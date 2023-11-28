import { useRouter } from "next/router";

import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";

import {Network} from "interfaces/network";

import {useMarketplaceStore} from "x-hooks/stores/marketplace/use-marketplace.store";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";

import VotingPowerPageView from "./view";

export default function VotingPowerPage() {
  const { query } = useRouter();

  const marketplace = useMarketplace();
  const { update } = useMarketplaceStore();
  const { start, isServiceReady } = useDao();

  const { network } = query;
  const isOnNetwork = !!network;
  const hasNetworkTokenSaved = !marketplace?.active || !!marketplace?.active?.networkToken && isOnNetwork;

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
      handleMarketplaceChange={handleMarketplaceChange}
      isLoading={isServiceReady()}
    >
      <NoNetworkTokenModal
        isVisible={isOnNetwork && !hasNetworkTokenSaved}
      />
      <VotingPowerNetwork />
    </VotingPowerPageView>
  );
}
