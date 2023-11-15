import { useRouter } from "next/router";

import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import VotingPowerMultiNetwork from "components/profile/pages/voting-power/multi-network/controller";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";

import useMarketplace from "x-hooks/use-marketplace";

import VotingPowerPageView from "./view";

export default function VotingPowerPage() {
  const { query } = useRouter();

  const marketplace = useMarketplace();

  const { network } = query;

  const isOnNetwork = !!network;
  const hasNetworkTokenSaved = !marketplace?.active || 
    !!marketplace?.active?.networkToken && isOnNetwork;

  function renderChildrenVotingPower() {
    if (isOnNetwork) return <VotingPowerNetwork />;

    return <VotingPowerMultiNetwork />;
  }

  return (
    <VotingPowerPageView>
      <>
        <NoNetworkTokenModal
          isVisible={isOnNetwork && !hasNetworkTokenSaved}
        />
        {renderChildrenVotingPower()}
      </>
    </VotingPowerPageView>
  );
}
