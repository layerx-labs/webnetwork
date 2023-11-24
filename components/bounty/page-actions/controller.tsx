import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { PageActionsControllerProps } from "components/bounty/page-actions/page-actions";
import PageActionsView from "components/bounty/page-actions/view";

import { getIssueState } from "helpers/handleTypeIssue";
import { QueryKeys } from "helpers/query-keys";

import { useStartWorking } from "x-hooks/api/task";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function PageActions({
  handleEditIssue,
  isEditIssue,
  currentBounty,
  updateBountyData
}: PageActionsControllerProps) {
  const { t } = useTranslation(["common", "deliverable", "bounty", "proposal"]);
  const { query, push } = useRouter();

  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();
  const { currentUser } = useUserStore();
  const { mutate: startWorking, isLoading: isExecuting } = useReactQueryMutation({
    queryKey: QueryKeys.bounty(currentBounty?.id?.toString()),
    mutationFn: () => useStartWorking({
      id: currentBounty?.id
    }),
    toastSuccess: t("bounty:actions.start-working.success"),
    toastError: t("bounty:actions.start-working.error")
  });

  function getDeliverablesAbleToBeProposed() {
    const isProposalValid = p => !p?.isDisputed && !p?.isMerged && !p?.refusedByBountyOwner;
    const deliverables = currentBounty?.deliverables;
    const deliverableIdsOfValidProposals = 
      currentBounty?.mergeProposals?.filter(isProposalValid)?.map(p => p?.deliverableId) || [];
    return deliverables.filter(d => !deliverableIdsOfValidProposals.includes(d.id) && d.markedReadyForReview);
  }

  const deliverablesAbleToBeProposed = getDeliverablesAbleToBeProposed();
  const isCouncilMember = !!currentUser?.isCouncil;
  const isBountyReadyToPropose = !!currentBounty?.isReady;
  const bountyState = getIssueState({
    state: currentBounty?.state,
    amount: currentBounty?.amount,
    fundingAmount: currentBounty?.fundingAmount,
  });
  const isWalletConnected = !!currentUser?.walletAddress;
  const isBountyOpen = currentBounty?.isClosed === false && currentBounty?.isCanceled === false;
  const isBountyInDraft = !!currentBounty?.isDraft;
  const isWorkingOnBounty = !!currentBounty?.working?.find(id => +id === +currentUser?.id);
  const isBountyOwner = isWalletConnected && currentBounty?.user?.address === currentUser?.walletAddress;
  const isFundingRequest = !!currentBounty?.isFundingRequest
  const isStateToWorking = ["proposal", "open", "ready"].some((value) => value === bountyState)
  const isUpdateAmountButton =
    isWalletConnected &&
    isBountyOpen &&
    isBountyOwner &&
    isBountyInDraft &&
    !isFundingRequest &&
    !isEditIssue;
  const isStartWorkingButton =
    isWalletConnected &&
    !isBountyInDraft &&
    isBountyOpen &&
    !isWorkingOnBounty &&
    isStateToWorking;
  const isEditButton = isWalletConnected && isBountyInDraft && isBountyOwner;

  const rest = {
    isUpdateAmountButton,
    isStartWorkingButton,
    isEditButton,
    isBountyInDraft,
    isWalletConnected,
    isWorkingOnBounty,
    isBountyOpen,
    isCreatePr:
      isWalletConnected &&
      isBountyOpen &&
      !isBountyInDraft &&
      isWorkingOnBounty,
    isCreateProposal:
      isWalletConnected &&
      isCouncilMember &&
      isBountyOpen &&
      isBountyReadyToPropose &&
      !!deliverablesAbleToBeProposed?.length,
  };

  function onCreateDeliverableClick() {
    push(getURLWithNetwork("/task/[id]/create-deliverable", query));
  }
  
  return (
    <PageActionsView
      isExecuting={isExecuting}
      onCreateDeliverableClick={onCreateDeliverableClick}
      handleStartWorking={startWorking}
      handleEditIssue={handleEditIssue}
      bounty={currentBounty}
      updateBountyData={updateBountyData}
      deliverables={deliverablesAbleToBeProposed}
      {...rest}
    />
  );
}