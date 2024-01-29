import DeliverableDetailsView from "components/proposal/deliverable-details/view";

import { Deliverable, IssueBigNumberData, IssueData } from "interfaces/issue-data";

import useMarketplace from "x-hooks/use-marketplace";

interface ProposalDeliverableDetailsProps {
  deliverable: Deliverable;
  issue: IssueData | IssueBigNumberData;
}

export default function ProposalDeliverableDetails({
  deliverable,
  issue,
}: ProposalDeliverableDetailsProps) {
  const { getURLWithNetwork } = useMarketplace();

  const deliverableHref = getURLWithNetwork("/task/[id]/deliverable/[deliverableId]", {
    id: issue?.id,
    deliverableId: deliverable?.id,
    fromProposal: true
  });
  const asPath = `/task/${issue?.id}/deliverable/${deliverable?.id}`;

  return(
    <DeliverableDetailsView
      id={deliverable?.id}
      createdAt={deliverable?.createdAt}
      deliverableHref={deliverableHref}
      deliverableTitle={deliverable?.title}
      user={deliverable?.user}
      asPath={asPath}
    />
  );
}