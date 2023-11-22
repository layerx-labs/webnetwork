import { useRouter } from "next/router";

import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import VotingPowerMultiNetwork from "components/profile/pages/voting-power/multi-network/controller";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";

import { useAppState } from "contexts/app-state";

import {lowerCaseCompare} from "helpers/string";

import VotingPowerPageView from "./view";

export default function VotingPowerPage() {
  const { query } = useRouter();

  const { state } = useAppState();

  const { network } = query;

  const isOnNetwork = !!network;
  const activeNetwork = state.Service?.network?.active;
  const isNetworkGovernor = lowerCaseCompare(state.currentUser?.walletAddress, activeNetwork?.creatorAddress);
  const hasTokenSaved = !!activeNetwork?.networkToken;
  const isModalVisible = !hasTokenSaved && isNetworkGovernor && isOnNetwork;

  function renderChildrenVotingPower() {
    if (isOnNetwork) return <VotingPowerNetwork />;

    return <VotingPowerMultiNetwork />;
  }

  return (
    <VotingPowerPageView>
      <>
        <NoNetworkTokenModal
          isVisible={isModalVisible}
        />
        {renderChildrenVotingPower()}
      </>
    </VotingPowerPageView>
  );
}
