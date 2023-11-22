import { useRouter } from "next/router";

import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import VotingPowerMultiNetwork from "components/profile/pages/voting-power/multi-network/controller";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";

import { useAppState } from "contexts/app-state";

import VotingPowerPageView from "./view";

export default function VotingPowerPage() {
  const { query } = useRouter();

  const { state } = useAppState();

  const { network } = query;

  const isOnNetwork = !!network;
  const hasNetworkTokenSaved = !isOnNetwork || !!state.Service?.network?.active?.networkToken && isOnNetwork;

  function renderChildrenVotingPower() {
    if (isOnNetwork) return <VotingPowerNetwork />;

    return <VotingPowerMultiNetwork />;
  }

  return (
    <VotingPowerPageView>
      <>
        <NoNetworkTokenModal
          isVisible={!hasNetworkTokenSaved}
        />
        {renderChildrenVotingPower()}
      </>
    </VotingPowerPageView>
  );
}
