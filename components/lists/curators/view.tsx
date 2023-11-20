import { useTranslation } from "next-i18next";

import CuratorListItem from "components/lists/curators/item/controller";
import List from "components/lists/list/controller";

import {PaginatedCuratorOverview} from "types/api";

interface CuratorsListViewProps {
  curators: PaginatedCuratorOverview;
}

export default function CuratorsListView({ curators }: CuratorsListViewProps) {
  const { t } = useTranslation(["common", "council"]);

  const isListEmpty = !curators?.count;
  const hasMore = !isListEmpty && curators?.currentPage < curators?.pages;
  const header = [
    t("council:council-table.address"),
    t("council:council-table.closed-proposals"),
    t("council:council-table.disputed-proposals"),
    t("council:council-table.disputes"),
    t("council:council-table.total-votes"),
    "Networks",
    t("council:council-table.actions"),
  ];
  const sortOptions = [
    {
      label: "Total Votes",
      value: "totalVotes",
      sortBy: "totalVotes",
      order: "DESC",
    }, {
      label: "Accepted Proposals",
      value: "acceptedProposals",
      sortBy: "acceptedProposals",
      order: "DESC",
    }, {
      label: "Disputed Proposals",
      value: "disputedProposals",
      sortBy: "disputedProposals",
      order: "DESC",
    }, {
      label: "Disputes",
      value: "disputes",
      sortBy: "disputes",
      order: "DESC",
    },
  ];

  return (
    <List
      isEmpty={isListEmpty}
      header={header}
      hasMorePages={hasMore}
      searchPlaceholder={"Search curator"}
      emptyMessage={"No curators found"}
      sortOptions={sortOptions}
      chainFilters
    >
      {curators?.rows?.map((curator) => (
        <CuratorListItem
          key={curator?.address}
          curator={curator}
        />
      ))}
    </List>
  );
}
