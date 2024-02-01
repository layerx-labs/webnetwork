import { useEffect, useState } from "react";

import DeliverablesListView from "components/lists/deliverables/deliverables-list.view";

import { DeliverablePaginatedData } from "types/api";

interface DeliverablesListProps {
  deliverables: DeliverablePaginatedData;
}
export default function DeliverablesList ({
  deliverables,
}: DeliverablesListProps) {
  const [list, setList] = useState<DeliverablePaginatedData>();

  const hasMorePages = !!list && list?.currentPage < list?.pages;

  useEffect(() => {
    if (!deliverables) return;

    setList(previous => {
      if (!previous || deliverables.currentPage === 1)
        return deliverables;

      return {
        ...previous,
        ...deliverables,
        rows: previous?.rows?.concat(deliverables?.rows)
      };
    });
  }, [deliverables]);

  return (
    <DeliverablesListView
      deliverables={list?.rows}
      hasMorePages={hasMorePages}
    />
  );
}