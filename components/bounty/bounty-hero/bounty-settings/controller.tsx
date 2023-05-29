import { useEffect, useState } from "react";

import { useAppState } from "contexts/app-state";

import { getIssueState } from "helpers/handleTypeIssue";

import { useAuthentication } from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";
import { useBounty } from "x-hooks/use-bounty";

import BountySettingsView from "./view";

export default function BountySettingsController({
  handleEditIssue,
  isEditIssue,
}: {
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
}) {
  const [isCancelable, setIsCancelable] = useState(false);
  const { state } = useAppState();
  const { handleReedemIssue, handleHardCancelBounty } = useBepro();
  const { updateWalletBalance } = useAuthentication();
  const { getDatabaseBounty } = useBounty();

  const objViewProps = {
    isWalletConnected: !!state.currentUser?.walletAddress,
    isGithubConnected: !!state.currentUser?.login,
    isBountyInDraft: !!state.currentBounty?.data?.isDraft,
    hasOpenPullRequest: !!state.currentBounty?.data?.pullRequests?.find((pullRequest) =>
        pullRequest?.githubLogin === state.currentUser?.login &&
        pullRequest?.status !== "canceled"),
    isBountyOwner:
      !!state.currentUser?.walletAddress &&
      state.currentBounty?.data?.creatorAddress &&
      state.currentBounty?.data?.creatorAddress ===
        state.currentUser?.walletAddress,

    isFundingRequest: !!state.currentBounty?.data?.isFundingRequest,
    isBountyFunded: state.currentBounty?.data?.fundedAmount?.isEqualTo(state.currentBounty?.data?.fundingAmount),
    isBountyOpen:
      state.currentBounty?.data?.isClosed === false &&
      state.currentBounty?.data?.isCanceled === false,
  };

  async function handleHardCancel() {
    handleHardCancelBounty().then(() => {
      updateWalletBalance();
      getDatabaseBounty(true);
    });
  }

  async function handleRedeem() {
    handleReedemIssue(getIssueState({
        state: state.currentBounty?.data?.state,
        amount: state.currentBounty?.data?.amount,
        fundingAmount: state.currentBounty?.data?.fundingAmount,
    }) === "funding").then(() => {
      updateWalletBalance(true);
      getDatabaseBounty(true);
    });
  }

  useEffect(() => {
    if (state.Service?.active && state.currentBounty?.data)
      (async () => {
        const cancelableTime = await state.Service?.active.getCancelableTime();
        const canceable =
          +new Date() >=
          +new Date(+state.currentBounty?.data.createdAt + cancelableTime);
        setIsCancelable(canceable);
      })();
  }, [state.Service?.active, state.currentBounty?.data]);

  return (
    <BountySettingsView
      isCancelable={isCancelable}
      bounty={state.currentBounty?.data}
      network={state.Service?.network}
      handleEditIssue={handleEditIssue}
      handleHardCancel={handleHardCancel}
      handleRedeem={handleRedeem}
      isEditIssue={isEditIssue}
      {...objViewProps}
    />
  );
}
