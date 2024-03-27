import List from "components/lists/list/controller";
import { MarketplaceListItem } from "components/lists/marketplaces/marketplace-list-item/marketplace-list-item.view";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";

export type GroupedMarketplace = Pick<Network, "name" | "logoIcon" | "fullLogo" | "colors" | "tokensLocked" | 
  "totalIssues" | "totalOpenIssues" | "networkToken" | "isClosed"> & {
  chains: SupportedChainData[];
}

type MarketplacesListViewProps = {
  groupedMarketplaces: GroupedMarketplace[]
}

export function MarketplacesListView ({ groupedMarketplaces }: MarketplacesListViewProps) {
  const header = [
    { label: "Marketplace" },
    { label: "Networks" },
    { label: "Open Tasks" },
    { label: "Total Tasks" },
    { label: "Token Locked" },
  ];

  return(
    <div className="mb-4">
      <List
        header={header}
        withSearchAndFilters={false}
      >
        {
          groupedMarketplaces?.map(m => <MarketplaceListItem marketplace={m} key={`marketplace-item-${m?.name}`} />)
        }
      </List>
    </div>
  );
}