import React from "react";

import { useTranslation } from "next-i18next";

import Comment from "components/comment";
import CustomContainer from "components/custom-container";
import GithubLink from "components/github-link";
import NothingFound from "components/nothing-found";

import { pullRequest } from "interfaces/issue-data";

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

  return (
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
              {isMakeReviewButton && (
                <MakeReviewButton
                  onClick={handleShowModal}
                  disabled={
                    isCreatingReview ||
                    isCancelling ||
                    isMakingReady ||
                    !isGithubConnected
                  }
                  isLoading={isCreatingReview}
                  withLockIcon={
                    isCancelling || isMakingReady || !isGithubConnected
                  }
                />
              )}

              {isMakeReadyReviewButton && (
                <MakeReadyReviewButton
                  onClick={handleMakeReady}
                  disabled={isCreatingReview || isCancelling || isMakingReady}
                  isLoading={isMakingReady}
                  withLockIcon={isCreatingReview || isCancelling}
                />
              )}

              {isCancelButton && (
                <CancelButton
                  onClick={handleCancel}
                  disabled={isCreatingReview || isCancelling || isMakingReady}
                  isLoading={isCancelling}
                  withLockIcon={isCreatingReview || isMakingReady}
                />
              )}

              {isApproveLink && (
                <ApproveLink
                  forcePath={githubPath}
                  hrefPath={`pull/${currentPullRequest?.githubId || ""}/files`}
                />
              )}

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
  );
}
