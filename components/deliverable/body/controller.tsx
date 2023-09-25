import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import DeliverableBodyView from "components/deliverable/body/view";

import { useAppState } from "contexts/app-state";

import { lowerCaseCompare } from "helpers/string";

import { NetworkEvents } from "interfaces/enums/events";
import { Deliverable, IssueBigNumberData } from "interfaces/issue-data";

import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import { useNetwork } from "x-hooks/use-network";

interface DeliverableBodyControllerProps {
  currentDeliverable: Deliverable;
  currentBounty: IssueBigNumberData;
  isCreatingReview: boolean;
  updateDeliverableData: () => void;
  handleShowModal: () => void;
}

export default function DeliverableBody({
  currentDeliverable,
  currentBounty,
  isCreatingReview,
  updateDeliverableData,
  handleShowModal,
}: DeliverableBodyControllerProps) {
  const router = useRouter();
  const { t } = useTranslation(["common", "deliverable"]);

  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();

  const { handleMakePullRequestReady, handleCancelPullRequest } = useBepro();
  const [isMakingReady, onMakeReady] = useContractTransaction(NetworkEvents.PullRequestReady,
                                                              handleMakePullRequestReady,
                                                              t("deliverable:actions.make-ready.success"),
                                                              t("deliverable:actions.make-ready.error"));
  const [isCancelling, onCancel] = useContractTransaction(NetworkEvents.PullRequestCanceled,
                                                          handleCancelPullRequest,
                                                          t("deliverable:actions.cancel.success"),
                                                          t("deliverable:actions.cancel.error"));

  const isCouncil = !!state?.Service?.network?.active?.isCouncil;
  const isWalletConnected = !!state.currentUser?.walletAddress;
  const isDeliverableReady = currentDeliverable?.markedReadyForReview;
  const isDeliverableCanceled = currentDeliverable?.canceled;
  const isDeliverableCancelable = currentDeliverable?.isCancelable;
  const isDeliverableCreator = lowerCaseCompare(currentDeliverable?.user?.address, state.currentUser?.walletAddress);
  const showMakeReadyWarning = !isDeliverableReady && isDeliverableCreator;
  const isMakeReviewButton =
    isWalletConnected &&
    isDeliverableReady &&
    !isDeliverableCanceled &&
    isCouncil

  const isMakeReadyReviewButton =
    isWalletConnected &&
    !isDeliverableReady &&
    !isDeliverableCanceled &&
    isDeliverableCreator;

  const isCancelButton =
    isWalletConnected &&
    !isDeliverableCanceled &&
    isDeliverableCancelable &&
    isDeliverableCreator;

  function handleMakeReady() {
    if (!currentBounty || !currentDeliverable) return;
    onMakeReady(currentBounty.contractId, currentDeliverable.prContractId)
      .then(() => updateDeliverableData())
      .catch(error => console.debug("Failed to make ready for review", error.toString()));
  }

  function handleCancel() {
    onCancel(currentBounty?.contractId, currentDeliverable?.prContractId)
      .then(() => {
        updateDeliverableData();
        router.push(getURLWithNetwork("/bounty/[id]", {
          id: currentBounty.id
        }));
      })
      .catch(error => console.debug("Failed to cancel", error.toString()));
  }

  return (
    <DeliverableBodyView
      currentBounty={currentBounty}
      currentDeliverable={currentDeliverable}
      isCreatingReview={isCreatingReview}
      showMakeReadyWarning={showMakeReadyWarning}
      handleShowModal={handleShowModal}
      handleCancel={handleCancel}
      handleMakeReady={handleMakeReady}
      isMakeReviewButton={isMakeReviewButton}
      isMakeReadyReviewButton={isMakeReadyReviewButton}
      isCancelButton={isCancelButton}
      isCancelling={isCancelling}
      isMakingReady={isMakingReady}
      currentUser={state.currentUser}
      isCouncil={isCouncil}
    />
  );
}