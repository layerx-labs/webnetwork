import { useTranslation } from "next-i18next";

import {
  DeliverablesListItem
} from "components/lists/deliverables/deliverables-list-item/deliverables-list-item.controller";
import List from "components/lists/list/controller";

import { Deliverable } from "interfaces/issue-data";

interface DeliverablesListViewProps {
  deliverables: Deliverable[];
  hasMorePages: boolean;
}
export default function DeliverablesListView ({
  deliverables,
  hasMorePages
}: DeliverablesListViewProps) {
  const { t } = useTranslation(["common", "deliverable"]);
  
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
        searchPlaceholder={t("deliverable:search-for-a-deliverable")}
        sortOptions={sortOptions}
        hasMorePages={hasMorePages}
        chainFilters
        networkFilter
        infinite
      >
        {deliverables?.map(deliverable =>
          <DeliverablesListItem deliverable={deliverable} key={`deliverable-item-${deliverable?.id}`} />)}
      </List>
    </div>
  );
}