import {useEffect, useState} from "react";

import { dehydrate } from "@tanstack/react-query";
import { getToken } from "next-auth/jwt";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import DeliverableBody from "components/deliverable/body/controller";
import CreateReviewModal from "components/deliverable/create-review-modal/controller";
import DeliverableHero from "components/deliverable/hero/controller";

import { deliverableParser, issueParser } from "helpers/issue";
import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { CreateComment } from "x-hooks/api/comments";
import { getDeliverable } from "x-hooks/api/deliverable";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";

const { serverRuntimeConfig: { auth: { secret } } } = getConfig();

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
  const token = await getToken({ req, secret: secret });
  const queryClient = getReactQueryClient();
  const { deliverableId } = query;
  const deliverableData = await getDeliverable(+deliverableId);

  const redirectToTask = {
    redirect: {
      permanent: false,
      destination: `/${deliverableData?.issue?.network?.name}/task/${deliverableData?.issue?.id}`,
    },
    props: {},
  };
  
  if (deliverableData?.issue?.privateDeliverables) {
    const currentUser = token?.address as string;
    const isTaskCreator = lowerCaseCompare(currentUser, deliverableData?.issue?.user?.address);
    const isDeliverableCreator = lowerCaseCompare(currentUser, deliverableData?.user?.address);

    if (!currentUser || !isTaskCreator && !isDeliverableCreator)
      return redirectToTask;
  }

  await queryClient.setQueryData(QueryKeys.deliverable(deliverableId?.toString()), deliverableData);

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