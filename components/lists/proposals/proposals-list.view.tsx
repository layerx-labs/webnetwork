import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("common");

  const sortOptions = [
    {
      label: t("sort.types.newest"),
      value: "newest",
      sortBy: "createdAt",
      order: "DESC",
    }, {
      label: t("sort.types.oldest"),
      value: "oldest",
      sortBy: "createdAt",
      order: "ASC",
    }
  ];
  
  return (
    <div className="mb-4">
      <List
        searchPlaceholder={t("search-for-proposal")}
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