import { useEffect, useState } from "react";

import BountyStatusProgressView from "components/bounty/status-progress/view";

import { IssueBigNumberData } from "interfaces/issue-data";

import useMarketplace from "x-hooks/use-marketplace";

export default function BountyStatusProgress({ currentBounty }: { currentBounty: IssueBigNumberData}) {
  const [stepColor, setStepColor] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>();
  const [steps, setSteps] = useState<string[]>([
    "draft",
    "funding",
    "development",
    "validation",
    "closed",
  ]);

  const marketplace = useMarketplace();

  const chainTime = Date.parse(new Date().toISOString())

  const { isClosed, isCanceled, isDraft, isFundingRequest, isFunded } =
    currentBounty || {};

  const isInValidation = !!(currentBounty?.state === "proposal");
  const creationDate = currentBounty?.createdAt;
  const fundedDate = currentBounty?.fundedAt;
  const closedDate = isClosed
    ? currentBounty?.updatedAt
    : undefined;
  const lastProposalCreationDate = currentBounty?.mergeProposals
    ?.filter((proposal) => !proposal.refusedByBountyOwner && !proposal.isDisputed)
    .reduce((acc, curr) =>
        +curr.contractCreationDate > +acc
          ? new Date(curr.contractCreationDate)
          : acc,
            creationDate);

  function toRepresentationHeight() {
    return currentStep === 0 ? "1px" : `${currentStep * 66.7}px`;
  }

  function heightIssueProgressHorizontal() {
    return isFundingRequest ? "270px" : "200px";
  }

  useEffect(() => {
    const isFundingStep = !!steps.find((name) => name === "funding");

    if (isFundingRequest && !isFundingStep)
      setSteps((currentState) => {
        currentState.splice(1, 0, "funding");
        return currentState;
      });

    if (!isFundingRequest && isFundingStep)
      setSteps((currentState) => {
        return currentState.filter((state) => state !== "funding");
      });
  }, [isFundingRequest]);

  useEffect(() => {
    //Draft -> isIssueInDraft()
    //Development -> estado inicial
    //Finalized -> recognizedAsFinished == true
    //Dispute Window -> mergeProposalAmount > 0
    //Closed and Distributed -> finalized == true
    const addIsFunding = isFundingRequest ? 1 : 0;

    let step = 0 + addIsFunding;
    let stepColor = "primary";

    if (isClosed) step = 3 + addIsFunding;
    else if (isInValidation) step = 2 + addIsFunding;
    else if (!isDraft && (!isFundingRequest || isFunded))
      step = 1 + addIsFunding;

    if (isCanceled) stepColor = "danger";
    if (isClosed) stepColor = "success";

    setStepColor(stepColor);
    setCurrentStep(step);
  }, [
    isClosed,
    isDraft,
    isCanceled,
    isInValidation,
    isFundingRequest,
    isFunded,
  ]);

  return (
    <BountyStatusProgressView
      steps={steps}
      stepColor={stepColor}
      toRepresentationHeight={toRepresentationHeight}
      heightIssueProgressHorizontal={heightIssueProgressHorizontal}
      creationDate={creationDate}
      fundedDate={fundedDate}
      closedDate={closedDate}
      lastProposalCreationDate={lastProposalCreationDate}
      isFundingRequest={isFundingRequest}
      isCanceled={isCanceled}
      isClosed={isClosed}
      chainTime={chainTime}
      draftTime={marketplace?.active?.draftTime}
      currentStep={currentStep}
    />
  );
}
