import { Deliverable } from "interfaces/issue-data";

import { Status } from "types/components";

export function getDeliverableStatus (deliverable: Deliverable): Status {
  const isTaskClosed = deliverable?.issue?.isClosed;
  const proposalMerged = deliverable?.issue?.merged;
  const deliverableAcceptedId = isTaskClosed ?
    deliverable?.issue?.mergeProposals?.find(p => +p.contractId === +proposalMerged)?.deliverableId : null;
  if (isTaskClosed && deliverableAcceptedId !== deliverable?.id)
    return "not-accepted";
  if (deliverable?.accepted)
    return "accepted";
  if (deliverable?.canceled)
    return "canceled";
  if (deliverable?.markedReadyForReview)
    return "review";
  return "draft";
}