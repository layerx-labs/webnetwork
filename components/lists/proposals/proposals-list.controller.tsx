import { useEffect, useState } from "react";

import ProposalsListView from "components/lists/proposals/proposals-list.view";

import { ProposalPaginatedData } from "types/api";

interface ProposalsListProps {
  proposals: ProposalPaginatedData;
}
export default function ProposalsList ({
  proposals,
}: ProposalsListProps) {
  const [list, setList] = useState<ProposalPaginatedData>();

  const hasMorePages = !!list && list?.currentPage < list?.pages;

  useEffect(() => {
    if (!proposals) return;

    setList(previous => {
      if (!previous || proposals.currentPage === 1)
        return proposals;

      return {
        ...previous,
        ...proposals,
        rows: previous?.rows?.concat(proposals?.rows)
      };
    });
  }, [proposals]);

  return (
    <ProposalsListView
      proposals={list?.rows}
      hasMorePages={hasMorePages}
    />
  );
}