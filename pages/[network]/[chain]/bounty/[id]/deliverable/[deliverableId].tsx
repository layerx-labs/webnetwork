import { useState } from "react";

import { dehydrate } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import DeliverableBody from "components/deliverable/body/controller";
import CreateReviewModal from "components/deliverable/create-review-modal/controller";
import DeliverableHero from "components/deliverable/hero/controller";

import { useAppState } from "contexts/app-state";

import { deliverableParser, issueParser } from "helpers/issue";
import { QueryKeys } from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import { CreateComment } from "x-hooks/api/comments";
import { getDeliverable } from "x-hooks/api/deliverable";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQuery from "x-hooks/use-react-query";

export default function DeliverablePage() {
  const router = useRouter();
  const { t } = useTranslation(["common", "deliverable"]);

  const { review, deliverableId } = router.query;

  const [showModal, setShowModal] = useState(!!review);
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  const { state } = useAppState();
  const { addError, addSuccess } = useToastStore();
  const { data: deliverableData, invalidate: invalidateDeliverable } = 
  useReactQuery(QueryKeys.deliverable(deliverableId?.toString()), () => getDeliverable(+deliverableId));
  
  const currentBounty = issueParser(deliverableData?.issue);
  const currentDeliverable = deliverableParser(deliverableData, currentBounty?.mergeProposals);
  const isDeliverableReady = !!currentDeliverable?.markedReadyForReview;

  function handleCreateReview(body: string) {
    if (!state.currentUser?.walletAddress) return;

    setIsCreatingReview(true);

    CreateComment({
      type: 'review',
      issueId: +currentBounty.id,
      deliverableId: currentDeliverable.id,
      comment: body
    }).then(() => {
      addSuccess(t("actions.success"), t("deliverable:actions.review.success"));
      invalidateDeliverable();
      setShowModal(false)
    }).catch(() => {
      addError(t("actions.failed"), t("deliverable:actions.review.error"));
    })
    .finally(() => {
      setIsCreatingReview(false);
    });
  }

  function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      <DeliverableHero currentDeliverable={currentDeliverable} currentBounty={currentBounty} />

      <DeliverableBody 
        currentDeliverable={currentDeliverable} 
        currentBounty={currentBounty} 
        isCreatingReview={isCreatingReview} 
        updateDeliverableData={invalidateDeliverable}
        handleShowModal={handleShowModal}      
      />

      <CreateReviewModal
        show={showModal && isDeliverableReady}
        currentBounty={currentBounty} 
        deliverable={currentDeliverable}
        isExecuting={isCreatingReview}
        onConfirm={handleCreateReview}
        onCloseClick={handleCloseModal}
      />

      <ConnectWalletButton asModal={true}/>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const queryClient = getReactQueryClient();
  const { deliverableId } = query;
  const deliverableKey = QueryKeys.deliverable(deliverableId?.toString());
  await queryClient.prefetchQuery(deliverableKey, () => getDeliverable(+deliverableId));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "deliverable",
        "connect-wallet-button",
        "funding"
      ]))
    }
  };
};