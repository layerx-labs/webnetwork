import { useRouter } from "next/router";

import {
  DeliverablesListItemView
} from "components/lists/deliverables/deliverables-list-item/deliverables-list-item.view";

import { getDeliverableStatus } from "helpers/deliverable";
import { getTimeDifferenceInWords } from "helpers/formatDate";

import { Deliverable } from "interfaces/issue-data";

import useMarketplace from "x-hooks/use-marketplace";

interface DeliverablesListItemProps {
  deliverable: Deliverable;
}
export function DeliverablesListItem ({
  deliverable,
}: DeliverablesListItemProps) {
  const router = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  const status = getDeliverableStatus(deliverable);

  function onClick () {
    router.push(getURLWithNetwork("/task/[id]/deliverable/[deliverableId]", {
      network: deliverable?.issue?.network?.name,
      id: deliverable?.issue?.id,
      deliverableId: deliverable?.id,
    }));
  }

  return (
    <DeliverablesListItemView
      deliverable={deliverable}
      status={status}
      timeDifferenceText={getTimeDifferenceInWords(new Date(deliverable?.createdAt), new Date(), true)}
      onClick={onClick}
    />
  );
}