import { useRouter } from "next/router";

import { getIssueState } from "helpers/handleTypeIssue";

import { IssueBigNumberData } from "interfaces/issue-data";

import BountyHeroView from "./view";

export default function BountyHero({
  handleEditIssue,
  isEditIssue,
  currentBounty
}: {
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
  currentBounty: IssueBigNumberData
}) {
  const router = useRouter();

  const { network } = router.query;
  const currentState = getIssueState({
    state: currentBounty?.state,
    amount: currentBounty?.amount,
    fundingAmount: currentBounty?.fundingAmount,
  });

  return (
    <BountyHeroView
      bounty={currentBounty}
      network={network}
      currentState={currentState}
      handleEditIssue={handleEditIssue}
      isEditIssue={isEditIssue}
    />
  );
}
