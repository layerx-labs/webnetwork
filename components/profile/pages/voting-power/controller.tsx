import VotingPowerPageView from "components/profile/pages/voting-power/view";

import {Network} from "interfaces/network";

import {useMarketplaceStore} from "x-hooks/stores/marketplace/use-marketplace.store";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";

export default function VotingPowerPage() {
  const { start } = useDao();
  const marketplace = useMarketplace();
  const { update } = useMarketplaceStore();
  const isNoNetworkTokenModalVisible = !marketplace?.active || !!marketplace?.active?.networkToken;

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
      isNoNetworkTokenModalVisible={isNoNetworkTokenModalVisible}
    />
  );
}
