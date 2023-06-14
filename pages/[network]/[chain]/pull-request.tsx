import React, { useEffect, useState } from "react";

import { SSRConfig, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import Comment from "components/comment";
import ConnectWalletButton from "components/connect-wallet-button";
import ContractButton from "components/contract-button";
import CreateReviewModal from "components/create-review-modal";
import CustomContainer from "components/custom-container";
import GithubLink from "components/github-link";
import NothingFound from "components/nothing-found";
import PullRequestHero from "components/pull-request-hero";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import { useAppState } from "contexts/app-state";
import { BountyEffectsProvider } from "contexts/bounty-effects";
import { changeCurrentBountyComments } from "contexts/reducers/change-current-bounty";
import { addToast } from "contexts/reducers/change-toaster";

import { issueParser } from "helpers/issue";

import { MetamaskErrors } from "interfaces/enums/Errors";
import { NetworkEvents } from "interfaces/enums/events";
import {
  IssueBigNumberData,
  IssueData,
  pullRequest,
} from "interfaces/issue-data";

import {
  getBountyData,
  getBountyOrPullRequestComments,
  getPullRequestReviews,
  getPullRequestsDetails,
} from "x-hooks/api/get-bounty-data";
import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";
import { useBounty } from "x-hooks/use-bounty";
import { useNetwork } from "x-hooks/use-network";

interface PagePullRequestProps {
  bounty: IssueData;
  pullRequest: pullRequest;
  _nextI18Next?: SSRConfig;
}

export default function PullRequestPage({ pullRequest, bounty }: PagePullRequestProps) {
  const { t } = useTranslation(["common", "pull-request"]);

  const [showModal, setShowModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isMakingReady, setIsMakingReady] = useState(false);
  const [currentPullRequest, setCurrentPullRequest] = useState<pullRequest>({
    ...pullRequest,
    createdAt: new Date(pullRequest.createdAt),
  });
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  const currentBounty: IssueBigNumberData = issueParser(bounty);
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const { getDatabaseBounty } = useBounty();
  const { getURLWithNetwork } = useNetwork();
  const { createReviewForPR, processEvent } = useApi();
  const { handleMakePullRequestReady, handleCancelPullRequest } = useBepro();

  const { prId, review } = router.query;

  const isWalletConnected = !!state.currentUser?.walletAddress;
  const isGithubConnected = !!state.currentUser?.login;
  const isPullRequestOpen = currentPullRequest?.state?.toLowerCase() === "open";
  const isPullRequestReady = !!currentPullRequest?.isReady;
  const isPullRequestCanceled = !!currentPullRequest?.isCanceled;
  const isPullRequestCancelable = !!currentPullRequest?.isCancelable;
  const isPullRequestCreator = currentPullRequest?.userAddress === state.currentUser?.walletAddress;
  const branchProtectionRules = state.Service?.network?.repos?.active?.branchProtectionRules;
  const approvalsRequired =
    branchProtectionRules ?
      branchProtectionRules[currentBounty?.branch]?.requiredApprovingReviewCount || 0 : 0;
  const canUserApprove = state.Service?.network?.repos?.active?.viewerPermission !== "READ";
  const approvalsCurrentPr = currentPullRequest?.approvals?.total || 0;
  const prsNeedsApproval = approvalsCurrentPr < approvalsRequired;

  function handleCreateReview(body: string) {
    if (!state.currentUser?.login) return;

    setIsCreatingReview(true);

    createReviewForPR({
      issueId: String(currentBounty?.issueId),
      pullRequestId: String(prId),
      githubLogin: state.currentUser?.login,
      body,
      networkName: state.Service?.network?.active?.name,
      wallet: state.currentUser.walletAddress
    })
      .then((response) => {
        dispatch(addToast({
          type: "success",
          title: t("actions.success"),
          content: t("pull-request:actions.review.success"),
        }));

        setCurrentPullRequest({
          ...currentPullRequest,
          comments: [...currentPullRequest.comments, response.data],
        });

        dispatch(changeCurrentBountyComments([...state.currentBounty?.comments || [], response.data]))

        setShowModal(false);
      })
      .catch(() => {
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

  function handleMakeReady() {
    if (!currentBounty || !currentPullRequest) return;

    setIsMakingReady(true);

    handleMakePullRequestReady(currentBounty.contractId, currentPullRequest.contractId)
      .then(txInfo => {
        const {blockNumber: fromBlock} = txInfo as { blockNumber: number };
        return processEvent(NetworkEvents.PullRequestReady, undefined, {fromBlock});
      })
      .then(() => {
        return getDatabaseBounty(true);
      })
      .then(() => {
        setIsMakingReady(false);
        dispatch(addToast({
          type: "success",
          title: t("actions.success"),
          content: t("pull-request:actions.make-ready.success"),
        }));
      })
      .catch(error => {
        setIsMakingReady(false);

        if (error?.code === MetamaskErrors.UserRejected) return;

        dispatch(addToast({
          type: "danger",
          title: t("actions.failed"),
          content: t("pull-request:actions.make-ready.error"),
        }));
      });
  }

  function handleCancel() {
    setIsCancelling(true);

    handleCancelPullRequest(currentBounty?.contractId, currentPullRequest?.contractId)
      .then(txInfo => {
        const {blockNumber: fromBlock} = txInfo as { blockNumber: number };
        return processEvent(NetworkEvents.PullRequestCanceled, undefined, {fromBlock});
      })
      .then(() => {
        getDatabaseBounty(true);

        dispatch(addToast({
          type: "success",
          title: t("actions.success"),
          content: t("pull-request:actions.cancel.success"),
        }));

        router.push(getURLWithNetwork('/bounty', {
          id: currentBounty.githubId,
          repoId: currentBounty.repository_id
        }));
      })
      .catch(error => {
        if (error?.code !== MetamaskErrors.UserRejected)
          dispatch(addToast({
            type: "danger",
            title: t("actions.failed"),
            content: t("pull-request:actions.cancel.error"),
          }));
      })
      .finally(() => {
        setIsCancelling(false);
      });
  }

  function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  useEffect(() => {
    if (review && currentPullRequest && state.currentUser?.login && state.connectedChain?.matchWithNetworkChain)
      setShowModal(true);
  }, [review, currentPullRequest, state.currentUser, state.connectedChain?.matchWithNetworkChain]);

  return (
    <BountyEffectsProvider>
      <PullRequestHero currentPullRequest={currentPullRequest}/>

      <CustomContainer>
        <div className="mt-3">
          <div className="row align-items-center bg-shadow border-radius-8 px-3 py-4">
            <div className="row">
              <div className="col-8">
                <span className="caption-large text-uppercase">
                  {t("pull-request:review", {
                    count: currentPullRequest?.comments?.length,
                  })}
                </span>
              </div>

              <div className="col-4 gap-20 p-0 d-flex justify-content-end">
                {/* Make Review Button */}
                {(isWalletConnected && isPullRequestOpen && isPullRequestReady && !isPullRequestCanceled) &&
                  <ReadOnlyButtonWrapper>
                    <ContractButton
                      className="read-only-button text-nowrap"
                      onClick={handleShowModal}
                      disabled={isCreatingReview || isCancelling || isMakingReady || !isGithubConnected}
                      isLoading={isCreatingReview}
                      withLockIcon={isCancelling || isMakingReady || !isGithubConnected}>
                      {t("actions.make-a-review")}
                    </ContractButton>
                  </ReadOnlyButtonWrapper>
                }

                {/* Make Ready for Review Button */}
                {(isWalletConnected &&
                  isPullRequestOpen &&
                  !isPullRequestReady &&
                  !isPullRequestCanceled &&
                  isPullRequestCreator) && (
                  <ReadOnlyButtonWrapper>
                    <ContractButton
                      className="read-only-button text-nowrap"
                      onClick={handleMakeReady}
                      disabled={isCreatingReview || isCancelling || isMakingReady}
                      isLoading={isMakingReady}
                      withLockIcon={isCreatingReview || isCancelling}>
                      {t("pull-request:actions.make-ready.title")}
                    </ContractButton>
                  </ReadOnlyButtonWrapper>
                )
                }

                {/* Cancel Button */}
                {(isWalletConnected &&
                  !isPullRequestCanceled &&
                  isPullRequestCancelable &&
                  isPullRequestCreator) && (
                  <ReadOnlyButtonWrapper>
                    <ContractButton
                      className="read-only-button text-nowrap"
                      onClick={handleCancel}
                      disabled={isCreatingReview || isCancelling || isMakingReady}
                      isLoading={isCancelling}
                      withLockIcon={isCreatingReview || isMakingReady}
                    >
                      {t("actions.cancel")}
                    </ContractButton>
                  </ReadOnlyButtonWrapper>
                )
                }

                {/* Approve Link */}
                { (isWalletConnected &&
                   isGithubConnected &&
                   prsNeedsApproval &&
                   canUserApprove &&
                   isPullRequestReady &&
                   !isPullRequestCanceled) &&
                  <GithubLink
                    forcePath={state.Service?.network?.repos?.active?.githubPath}
                    hrefPath={`pull/${currentPullRequest?.githubId || ""}/files`}
                    color="primary"
                  >
                    {t("actions.approve")}
                  </GithubLink>
                }

                <GithubLink
                  forcePath={state.Service?.network?.repos?.active?.githubPath}
                  hrefPath={`pull/${currentPullRequest?.githubId || ""}`}>
                  {t("actions.view-on-github")}
                </GithubLink>
              </div>
            </div>

            <div className="col-12 mt-4">
              {!!currentPullRequest?.comments?.length &&
                React.Children.toArray(currentPullRequest?.comments?.map((comment, index) => (
                  <Comment comment={comment} key={index}/>
                )))}

              {!!currentPullRequest?.reviews?.length &&
                React.Children.toArray(currentPullRequest?.reviews?.map((comment, index) => (
                  <Comment comment={comment} key={index}/>
                )))}

              {(!currentPullRequest?.comments?.length && !currentPullRequest?.reviews?.length) &&
                <NothingFound
                  description={t("pull-request:errors.no-reviews-found")}
                />
              }
            </div>
          </div>
        </div>
      </CustomContainer>

      <CreateReviewModal
        show={showModal && isPullRequestReady}
        pullRequest={currentPullRequest}
        isExecuting={isCreatingReview}
        onConfirm={handleCreateReview}
        onCloseClick={handleCloseModal}
      />

      <ConnectWalletButton asModal={true}/>
    </BountyEffectsProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const { prId } = query;

  const bountyDatabase = await getBountyData(query)

  const pullRequestDatabase = bountyDatabase?.pullRequests?.find((pr) => +pr.githubId === +prId)

  const pullRequestDetail = await getPullRequestsDetails(bountyDatabase?.repository?.githubPath,
                                                         [pullRequestDatabase]);

  const pullRequestComments = await getBountyOrPullRequestComments(bountyDatabase?.repository?.githubPath, 
                                                                   +prId);
  
  const pullRequestReviews = await getPullRequestReviews(bountyDatabase?.repository?.githubPath, 
                                                         +prId);

  const pullRequest: pullRequest = {
    ...pullRequestDatabase,
    isMergeable: pullRequestDetail[0]?.isMergeable,
    merged: pullRequestDetail[0]?.merged,
    state: pullRequestDetail[0]?.state,
    comments: pullRequestComments,
    reviews: pullRequestReviews
  }
                                                           
  return {
    props: {
      bounty: bountyDatabase,
      pullRequest,
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
