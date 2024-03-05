import {useEffect, useState} from "react";

import { dehydrate } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import DeliverableBody from "components/deliverable/body/controller";
import CreateReviewModal from "components/deliverable/create-review-modal/controller";
import DeliverableHero from "components/deliverable/hero/controller";

import { deliverableParser, issueParser } from "helpers/issue";
import { QueryKeys } from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { CreateComment } from "x-hooks/api/comments";
import { getDeliverable } from "x-hooks/api/deliverable";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";

export default function DeliverablePage() {
  const router = useRouter();
  const { t } = useTranslation(["common", "deliverable"]);

  const { review, deliverableId } = router.query;

  const [showModal, setShowModal] = useState(!!review);
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  const { addError, addSuccess } = useToastStore();
  const { updateParamsOfActive } = useMarketplace();
  const { currentUser } = useUserStore();
  const { data: deliverableData, invalidate: invalidateDeliverable } =
  useReactQuery(QueryKeys.deliverable(deliverableId?.toString()), () => getDeliverable(+deliverableId));

  const currentBounty = issueParser(deliverableData?.issue);
  const currentDeliverable = deliverableParser(deliverableData, currentBounty?.mergeProposals);
  const isDeliverableReady = !!currentDeliverable?.markedReadyForReview;

  function handleCreateReview(body: string) {
    if (!currentUser?.walletAddress) return;

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

  async function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  useEffect(() => {
    if (deliverableData?.issue?.network?.chain?.chainId)
      updateParamsOfActive(deliverableData?.issue?.network);
  }, [deliverableData?.issue?.network?.chain?.chainId]);

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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const queryClient = getReactQueryClient();
  const { deliverableId } = query;
  const deliverableKey = QueryKeys.deliverable(deliverableId?.toString());
  await queryClient.prefetchQuery({
    queryKey: deliverableKey,
    queryFn: () => getDeliverable(+deliverableId),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await customServerSideTranslations(req, locale, [
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