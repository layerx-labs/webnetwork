import { useState } from "react";

import { SSRConfig, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import ConnectWalletButton from "components/connect-wallet-button";
import PullRequestBody from "components/pull-request/body/controller";
import CreateReviewModal from "components/pull-request/create-review-modal/controller";
import DeliverableHero from "components/pull-request/hero/controller";

import { useAppState } from "contexts/app-state";
import { addToast } from "contexts/reducers/change-toaster";

import { commentsParser, issueParser } from "helpers/issue";

import {
  Deliverable,
  IssueBigNumberData,
  IssueData,
} from "interfaces/issue-data";

import { getBountyData } from "x-hooks/api/bounty/get-bounty-data";
import getCommentsData from "x-hooks/api/comments/get-comments-data";
import CreateComment from "x-hooks/api/comments/post-comments";

interface PageDeliverableProps {
  bounty: IssueData;
  deliverable: Deliverable;
  _nextI18Next?: SSRConfig;
}

export default function DeliverablePage({ deliverable, bounty }: PageDeliverableProps) {
  const router = useRouter();
  {console.log('router.query', router.query)}
  const { t } = useTranslation(["common", "pull-request"]);

  const { id, review } = router.query;

  const [showModal, setShowModal] = useState(!!review);
  const [currentBounty, setCurrentBounty] = useState<IssueBigNumberData>(issueParser(bounty));
  const [currentDeliverable, setCurrentDeliverable] = useState<Deliverable>({
    ...deliverable,
    comments: commentsParser(deliverable.comments),
    createdAt: new Date(deliverable.createdAt),
  });
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  const { state, dispatch } = useAppState();

  const isDeliverableReady = !!currentDeliverable?.markedReadyForReview;

  function updateBountyData() {
    getBountyData(router.query)
      .then(issueParser)
      .then((bounty) => {
        const deliverableDatabase = bounty?.deliverables?.find((d) => +d.id === +id);

        setCurrentBounty(bounty);
        setCurrentDeliverable({
          ...deliverableDatabase,
          comments: currentDeliverable.comments,
        });
      });
  }

  function updateCommentData() {
    getCommentsData({ deliverableId: currentDeliverable?.id.toString() })
     .then((comments) => setCurrentDeliverable({
      ...currentDeliverable,
      comments: commentsParser(comments)
     }))
  }

  function handleCreateReview(body: string) {
    if (!state.currentUser?.walletAddress) return;

    setIsCreatingReview(true);

    CreateComment({
      type: 'review',
      issueId: +currentBounty.id,
      deliverableId: currentDeliverable.id,
      comment: body
    }).then(() => {
      dispatch(addToast({
        type: "success",
        title: t("actions.success"),
        content: t("pull-request:actions.review.success"),
      }));
      updateCommentData()
      setShowModal(false)
    }).catch(() => {
      dispatch(addToast({
        type: "danger",
        title: t("actions.failed"),
        content: t("pull-request:actions.review.error"),
      }));
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

      <PullRequestBody 
        currentDeliverable={currentDeliverable} 
        currentBounty={currentBounty} 
        isCreatingReview={isCreatingReview} 
        updateBountyData={updateBountyData}
        updateComments={updateCommentData}
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
  const { id } = query;

  const bountyDatabase = await getBountyData(query);

  const deliverableDatabase = bountyDatabase?.deliverables?.find((d) => +d.id === +id);

  const deliverableComments = await getCommentsData({ deliverableId: deliverableDatabase?.id.toString() });

  const deliverable: Deliverable = {
    ...deliverableDatabase,
    comments: deliverableComments
  }
                                                           
  return {
    props: {
      bounty: bountyDatabase,
      deliverable,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "pull-request",
        "connect-wallet-button",
        "funding"
      ]))
    }
  };
};