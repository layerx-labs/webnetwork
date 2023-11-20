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

  return (
    <List
      isEmpty={isListEmpty}
      header={header}
      hasMorePages={hasMore}
      searchPlaceholder={"Search curator"}
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
