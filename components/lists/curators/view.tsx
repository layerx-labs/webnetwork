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
    {
      label: t("council:council-table.address"),
    },
    {
      label: t("council:council-table.closed-proposals"),
      tip: t("council:tips.accepted-proposals")
    },
    {
      label: t("council:council-table.disputed-proposals"),
      tip: t("council:tips.disputed-proposals")
    },
    {
      label: t("council:council-table.disputes"),
      tip: t("council:tips.disputes")
    },
    {
      label: t("council:council-table.total-votes")
    },
    {
      label: t("council:council-table.networks")
    },
    {
      label: t("council:council-table.actions")
    },
  ];
  const sortOptions = [
    {
      label: t("council:council-table.total-votes"),
      value: "totalVotes",
      sortBy: "totalVotes",
      order: "DESC",
    }, {
      label: t("council:council-table.closed-proposals"),
      value: "acceptedProposals",
      sortBy: "acceptedProposals",
      order: "DESC",
    }, {
      label: t("council:council-table.disputed-proposals"),
      value: "disputedProposals",
      sortBy: "disputedProposals",
      order: "DESC",
    }, {
      label: t("council:council-table.disputes"),
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
      searchPlaceholder={t("council:search-by-address")}
      emptyMessage={t("council:no-curators-found")}
      sortOptions={sortOptions}
      chainFilters
      infinite
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
