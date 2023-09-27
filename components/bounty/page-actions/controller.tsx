import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { PageActionsControllerProps } from "components/bounty/page-actions/page-actions";
import PageActionsView from "components/bounty/page-actions/view";

import { useAppState } from "contexts/app-state";

import { getIssueState } from "helpers/handleTypeIssue";
import { QueryKeys } from "helpers/query-keys";

import { useStartWorking } from "x-hooks/api/bounty";
import { useNetwork } from "x-hooks/use-network";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function PageActions({
  handleEditIssue,
  isEditIssue,
  currentBounty,
  updateBountyData
}: PageActionsControllerProps) {
  const { t } = useTranslation(["common", "deliverable", "bounty", "proposal"]);
  const { query, push } = useRouter();

  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();
  const { mutate: startWorking, isLoading: isExecuting } = useReactQueryMutation({
    queryKey: QueryKeys.bounty(currentBounty?.id?.toString()),
    mutationFn: () => useStartWorking({
      id: currentBounty?.id,
      networkName: state.Service?.network?.active?.name
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
  const isCouncilMember = !!state.Service?.network?.active?.isCouncil;
  const isBountyReadyToPropose = !!currentBounty?.isReady;
  const bountyState = getIssueState({
    state: currentBounty?.state,
    amount: currentBounty?.amount,
    fundingAmount: currentBounty?.fundingAmount,
  });
  const isWalletConnected = !!state.currentUser?.walletAddress;
  const isBountyOpen = currentBounty?.isClosed === false && currentBounty?.isCanceled === false;
  const isBountyInDraft = !!currentBounty?.isDraft;
  const isWorkingOnBounty = !!currentBounty?.working?.find(id => +id === +state.currentUser?.id);
  const isBountyOwner = isWalletConnected && currentBounty?.user?.address === state.currentUser?.walletAddress;
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
    push(getURLWithNetwork("/bounty/[id]/create-deliverable", query));
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