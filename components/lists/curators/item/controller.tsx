import CuratorListItemView from "components/lists/curators/item/view";

import { Curator } from "interfaces/curators";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";

interface CuratorListItemProps {
  curator: Curator;
}

export default function CuratorListItem({
  curator
}: CuratorListItemProps) {
  const { goToProfilePage } = useMarketplace();
  const { currentUser } = useUserStore();

  const isConnected = !!currentUser?.walletAddress;
  const isSameAddress = currentUser?.walletAddress?.toLowerCase() === curator?.address?.toLowerCase();

  function onDelegateClick() {
    goToProfilePage("voting-power", {
      curatorAddress: curator?.address,
    });
  }
  
  return(
    <CuratorListItemView
      curator={curator}
      onDelegateClick={(isConnected && !isSameAddress ) ? onDelegateClick : undefined}
    />
  );
}