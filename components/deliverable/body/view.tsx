import Comments from "components/bounty/comments/controller";
import CustomContainer from "components/custom-container";
import If from "components/If";

import { CurrentUserState } from "interfaces/application-state";
import { Deliverable } from "interfaces/issue-data";

import useBreakPoint from "x-hooks/use-breakpoint";

import DeliverableButton from "./actions/deliverable-button";
import DeliverableDescription from "./description/view";
import DeliverableOriginLink from "./origin-link/view";

interface DeliverableBodyViewProps {
  currentDeliverable: Deliverable;
  isCreatingReview: boolean;
  handleShowModal: () => void;
  handleCancel: () => void;
  handleMakeReady: () => void;
  updateComments: () => void;
  isMakeReviewButton: boolean;
  isMakeReadyReviewButton: boolean;
  isCancelButton: boolean;
  isCancelling: boolean;
  isMakingReady: boolean;
  currentUser: CurrentUserState;
  bountyId: string;
}

export default function DeliverableBodyView({
  currentDeliverable,
  isCreatingReview,
  handleShowModal,
  handleCancel,
  handleMakeReady,
  isMakeReviewButton,
  isMakeReadyReviewButton,
  isCancelButton,
  isCancelling,
  isMakingReady,
  updateComments,
  currentUser,
  bountyId
}: DeliverableBodyViewProps) {  
  const { isMobileView, isTabletView } = useBreakPoint();

  function RenderMakeReviewButton({ className = "" }) {
    if (isMakeReviewButton)
      return (
        <DeliverableButton
          type="review"
          className={className}
          onClick={handleShowModal}
          disabled={
            isCreatingReview ||
            isCancelling ||
            isMakingReady
          }
          isLoading={isCreatingReview}
          withLockIcon={isCancelling || isMakingReady}
        />
      );
    
    return null;
  }

  function RenderMakeReadyReviewButton({ className = "" }) {
    if (isMakeReadyReviewButton)
      return (
        <DeliverableButton
          type="ready-review"
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
        <DeliverableButton
          type="cancel"
          className={className}
          onClick={handleCancel}
          disabled={isCreatingReview || isCancelling || isMakingReady}
          isLoading={isCancelling}
          withLockIcon={isCreatingReview || isMakingReady}
        />
      );

    return null;
  }

  return (
    <div className="mt-3">
      <CustomContainer>
        <If condition={isMobileView || isTabletView}>
          <div className="mb-3">
            <RenderMakeReviewButton className="col-12 mb-3"/>
            <RenderMakeReadyReviewButton className="col-12 mb-3"/>
            <RenderCancelButton className="col-12 text-white border-gray-500 "/>
          </div>
        </If>

        <div className="">
          <div className="row pb-2 mx-1">
              <div className={`col gap-20 p-0 d-flex flex-wrap justify-content-end`}>
                <If condition={!(isMobileView || isTabletView)}>
                  <>
                    <RenderMakeReviewButton />
                    <RenderMakeReadyReviewButton />
                    <RenderCancelButton />
                  </>
                </If>
              </div>
          </div>
        </div>
        <DeliverableOriginLink url={currentDeliverable.deliverableUrl} />
        <DeliverableDescription description={currentDeliverable.description}/>
        {currentDeliverable?.markedReadyForReview && (
          <Comments
            type="deliverable"
            updateData={updateComments}
            ids={{
              issueId: +bountyId,
              deliverableId: currentDeliverable?.id,
            }}
            comments={currentDeliverable?.comments}
            currentUser={currentUser}
            disableCreateComment={currentDeliverable?.canceled}
          />
        )}
      </CustomContainer>
    </div>
  );
}
