import { useRouter } from "next/router";

import { useAppState } from "contexts/app-state";

import { getIssueState } from "helpers/handleTypeIssue";

import BountyHeroView from "./view";

export default function BountyHeroController({
  handleEditIssue,
  isEditIssue,
}: {
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
}) {
  const router = useRouter();

  const { state } = useAppState();
  const { network } = router.query;
  const currentState = getIssueState({
    state: state.currentBounty?.data?.state,
    amount: state.currentBounty?.data?.amount,
    fundingAmount: state.currentBounty?.data?.fundingAmount,
  });

  return (
    <BountyHeroView
      bounty={state.currentBounty?.data}
      network={network}
      currentState={currentState}
      handleEditIssue={handleEditIssue}
      isEditIssue={isEditIssue}
    />
  );
}
