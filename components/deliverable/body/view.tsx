import { useTranslation } from "next-i18next";

import Comments from "components/bounty/comments/controller";
import { ContextualSpan } from "components/contextual-span";
import CustomContainer from "components/custom-container";
import DeliverableButton from "components/deliverable/body/actions/deliverable-button";
import DeliverableDescription from "components/deliverable/body/description/view";
import DeliverableOriginLink from "components/deliverable/body/origin-link/view";
import DeliverableInfoCuratorCard from "components/deliverable/info-curator-card/controller";
import If from "components/If";

import { CurrentUserState } from "interfaces/application-state";
import { Deliverable, IssueBigNumberData } from "interfaces/issue-data";

import {DeliverableButtonType} from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

interface DeliverableBodyViewProps {
  currentBounty: IssueBigNumberData;
  currentDeliverable: Deliverable;
  isCreatingReview: boolean;
  showMakeReadyWarning: boolean;
  handleShowModal: () => Promise<void>;
  handleCancel: () => Promise<void>;
  handleMakeReady: () => Promise<void>;
  isMakeReviewButton: boolean;
  isMakeReadyReviewButton: boolean;
  isCancelButton: boolean;
  isCancelling: boolean;
  isMakingReady: boolean;
  currentUser: CurrentUserState;
  isCouncil: boolean;
}

export default function DeliverableBodyView({
  currentBounty,
  currentDeliverable,
  isCreatingReview,
  showMakeReadyWarning,
  handleShowModal,
  handleCancel,
  handleMakeReady,
  isMakeReviewButton,
  isMakeReadyReviewButton,
  isCancelButton,
  isCancelling,
  isMakingReady,
  currentUser,
  isCouncil
}: DeliverableBodyViewProps) {  
  const { t } = useTranslation("deliverable");
  const { isMobileView, isTabletView } = useBreakPoint();

  const makeReviewButtonProps = {
    type: "review" as DeliverableButtonType,
    onClick: handleShowModal,
    disabled: isCreatingReview || isCancelling || isMakingReady,
    isLoading: isCreatingReview,
    withLockIcon: isCancelling || isMakingReady,
  };
  const makeReadyButtonProps = {
    type: "ready-review" as DeliverableButtonType,
    onClick: handleMakeReady,
    disabled: isCreatingReview || isCancelling || isMakingReady,
    isLoading: isMakingReady,
    withLockIcon: isCreatingReview || isCancelling,
  };
  const cancelButtonProps = {
    type: "cancel" as DeliverableButtonType,
    onClick: handleCancel,
    disabled: isCreatingReview || isCancelling || isMakingReady,
    isLoading: isCancelling,
    withLockIcon: isCreatingReview || isMakingReady,
  }

  return (
    <div className="mt-3">
      <CustomContainer>
        <If condition={!isCouncil}>
          <DeliverableInfoCuratorCard />
        </If>

        <If condition={isMobileView || isTabletView}>
          <div className="mb-3">
            <If condition={isMakeReviewButton}>
              <DeliverableButton
                className="col-12 mb-3"
                {...makeReviewButtonProps}
              />
            </If>

            <If condition={isMakeReadyReviewButton}>
              <DeliverableButton
                className="col-12 mb-3"
                {...makeReadyButtonProps}
              />
            </If>

            <If condition={isCancelButton}>
              <DeliverableButton
                className="col-12 mb-3"
                {...cancelButtonProps}
              />
            </If>
          </div>
        </If>

        <div className="">
          <div className="row pb-2 mx-1">
              <div className={`col gap-20 p-0 d-flex flex-wrap justify-content-end`}>
                <If condition={!(isMobileView || isTabletView)}>
                  <>
                    <If condition={isMakeReviewButton}>
                      <DeliverableButton
                        {...makeReviewButtonProps}
                      />
                    </If>
                    <If condition={isMakeReadyReviewButton}>
                      <DeliverableButton
                        {...makeReadyButtonProps}
                      />
                    </If>
                    <If condition={isCancelButton}>
                      <DeliverableButton
                        {...cancelButtonProps}
                      />
                    </If>
                  </>
                </If>
              </div>
          </div>
        </div>

        <If condition={showMakeReadyWarning}>
          <ContextualSpan
            context="warning"
            className="mt-2 mb-3"
            isAlert
          >
            {t("make-ready-warning")}
          </ContextualSpan>
        </If>

        <DeliverableOriginLink url={currentDeliverable.deliverableUrl} />

        <DeliverableDescription description={currentDeliverable.description}/>

        {currentDeliverable?.markedReadyForReview && (
          <Comments
            type="deliverable"
            ids={{
              issueId: +currentBounty?.id,
              deliverableId: currentDeliverable?.id,
            }}
            comments={currentDeliverable?.comments}
            currentUser={currentUser}
            disableCreateComment={currentDeliverable?.canceled || currentBounty?.isClosed || !isCouncil}
          />
        )}
      </CustomContainer>
    </div>
  );
}
