import List from "components/lists/list/controller";
import { ProposalsListItem } from "components/lists/proposals/proposals-list-item/proposals-list-item.controller";

import { Proposal } from "interfaces/proposal";

interface ProposalsListViewProps {
  proposals: Proposal[];
  hasMorePages: boolean;
}
export default function ProposalsListView ({
  proposals,
  hasMorePages
}: ProposalsListViewProps) {
  const sortOptions = [
    {
      label: "Newest",
      value: "newest",
      sortBy: "createdAt",
      order: "DESC",
    }, {
      label: "Oldest",
      value: "oldest",
      sortBy: "createdAt",
      order: "ASC",
    }
  ];
  
  return (
    <div className="mb-4">
      <List
        searchPlaceholder={"Search for a proposal by tastk title or description"}
        sortOptions={sortOptions}
        hasMorePages={hasMorePages}
        chainFilters
        networkFilter
        infinite
      >
        {proposals?.map(proposal => <ProposalsListItem proposal={proposal} />)}
      </List>
    </div>
  );
}