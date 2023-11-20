import CuratorListItemView from "components/lists/curators/item/view";

import {CuratorOverview} from "types/api";

interface CuratorListItemProps {
  curator: CuratorOverview;
}

export default function CuratorListItem({
  curator
}: CuratorListItemProps) {
  return(
    <CuratorListItemView
      curator={curator}
    />
  );
}