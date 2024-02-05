import {
  DeliverablesListItemView
} from "components/lists/deliverables/deliverables-list-item/deliverables-list-item.view";
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
        searchPlaceholder={"Search for a submission by its title or task title"}
        sortOptions={sortOptions}
        hasMorePages={hasMorePages}
        chainFilters
        networkFilter
        infinite
      >
        {deliverables?.map(deliverable => <DeliverablesListItemView deliverable={deliverable} />)}
      </List>
    </div>
  );
}