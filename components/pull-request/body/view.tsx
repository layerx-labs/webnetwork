import React from "react";

import { useTranslation } from "next-i18next";

import Comment from "components/comment";
import CustomContainer from "components/custom-container";
import GithubLink from "components/github-link";
import NothingFound from "components/nothing-found";

import { pullRequest } from "interfaces/issue-data";

import useBreakPoint from "x-hooks/use-breakpoint";

import ApproveLink from "./actions/approve-link.view";
import CancelButton from "./actions/cancel-button.view";
import MakeReadyReviewButton from "./actions/make-ready-review-button.view";
import MakeReviewButton from "./actions/make-review-button.view";

interface PullRequestBodyViewProps {
  currentPullRequest: pullRequest;
  isCreatingReview: boolean;
  handleShowModal: () => void;
  handleCancel: () => void;
  handleMakeReady: () => void;
  isMakeReviewButton: boolean;
  isMakeReadyReviewButton: boolean;
  isCancelButton: boolean;
  isApproveLink: boolean;
  isCancelling: boolean;
  isMakingReady: boolean;
  isGithubConnected: boolean;
  githubPath: string;
}

export default function PullRequestBodyView({
  currentPullRequest,
  isCreatingReview,
  handleShowModal,
  handleCancel,
  handleMakeReady,
  isMakeReviewButton,
  isMakeReadyReviewButton,
  isCancelButton,
  isApproveLink,
  isCancelling,
  isMakingReady,
  isGithubConnected,
  githubPath,
}: PullRequestBodyViewProps) {
  const { t } = useTranslation(["common", "pull-request"]);
  
  const { isMobileView, isTabletView } = useBreakPoint();

  function RenderMakeReviewButton({ className = "" }) {
    if (isMakeReviewButton)
      return (
        <MakeReviewButton
          className={className}
          onClick={handleShowModal}
          disabled={
            isCreatingReview ||
            isCancelling ||
            isMakingReady ||
            !isGithubConnected
          }
          isLoading={isCreatingReview}
          withLockIcon={isCancelling || isMakingReady || !isGithubConnected}
        />
      );
    
    return null;
  }

  function RenderMakeReadyReviewButton({ className = "" }) {
    if (isMakeReadyReviewButton)
      return (
        <MakeReadyReviewButton
          className={className}
          onClick={handleMakeReady}
          disabled={isCreatingReview || isCancelling || isMakingReady}
          isLoading={isMakingReady}
          withLockIcon={isCreatingReview || isCancelling}
        />
      );

    return null;
  }

  function RenderCancelButton({ className = ""}) {
    if(isCancelButton)
      return (
        <CancelButton
          className={className}
          onClick={handleCancel}
          disabled={isCreatingReview || isCancelling || isMakingReady}
          isLoading={isCancelling}
          withLockIcon={isCreatingReview || isMakingReady}
        />
      );

    return null;
  }

  function RenderApproveButton() {
    if(isApproveLink)
      return (
        <ApproveLink
          forcePath={githubPath}
          hrefPath={`pull/${currentPullRequest?.githubId || ""}/files`}
        />
      );
    
    return null;
  }

  return (
    <div className="mx-3 mt-3">
      <CustomContainer col={(isTabletView || isMobileView) ? 'col-12' : 'col-10'}>
        {(isMobileView || isTabletView) && (
          <div className="mb-3">
            <RenderMakeReviewButton className="col-12 mb-3"/>
            <RenderMakeReadyReviewButton className="col-12 mb-3"/>
            <RenderCancelButton className="col-12 text-white border-gray-500 "/>
          </div>
        )}
        <div className="">
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
                {!(isMobileView || isTabletView) && (
                  <>
                  <RenderMakeReviewButton />
                  <RenderMakeReadyReviewButton />
                  <RenderCancelButton />
                  </>
                )}

                <RenderApproveButton />
                <GithubLink
                  forcePath={githubPath}
                  hrefPath={`pull/${currentPullRequest?.githubId || ""}`}
                >
                  {t("actions.view-on-github")}
                </GithubLink>
              </div>
            </div>

            <div className="col-12 mt-4">
              {!!currentPullRequest?.comments?.length &&
                React.Children.toArray(currentPullRequest?.comments?.map((comment, index) => (
                    <Comment comment={comment} key={index} />
                  )))}

              {!!currentPullRequest?.reviews?.length &&
                React.Children.toArray(currentPullRequest?.reviews?.map((comment, index) => (
                    <Comment comment={comment} key={index} />
                  )))}

              {!currentPullRequest?.comments?.length &&
                !currentPullRequest?.reviews?.length && (
                  <NothingFound
                    description={t("pull-request:errors.no-reviews-found")}
                  />
                )}
            </div>
          </div>
        </div>
      </CustomContainer>
    </div>
  );
}
