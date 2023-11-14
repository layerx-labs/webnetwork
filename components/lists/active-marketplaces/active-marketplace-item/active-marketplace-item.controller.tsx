import { useState } from "react";

import {
  ActiveMarketplaceItemView
} from "components/lists/active-marketplaces/active-marketplace-item/active-marketplace-item.view";

import { ActiveMarketplace } from "types/api";

interface ActiveMarketplaceItemProps {
  marketplace: ActiveMarketplace;
}

export function ActiveMarketplaceItem({
  marketplace,
}: ActiveMarketplaceItemProps) {
  const [isChainsModalVisible, setIsChainsModalVisible] = useState(false);

  const setVisible = (e) => {
    e?.preventDefault();
    setIsChainsModalVisible(true);
  };
  const setHidden = () => setIsChainsModalVisible(false);

  return (
    <ActiveMarketplaceItemView
      marketplace={marketplace}
      isChainsModalVisible={isChainsModalVisible}
      onMoreClick={setVisible}
      onCloseClick={setHidden}
    />
  );
}
