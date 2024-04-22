import { GroupedMarketplace, MarketplacesListView } from "components/lists/marketplaces/marketplaces-list.view";

import { Network } from "interfaces/network";

type MarketplacesListProps = {
  marketplaces: Network[];
}

export function MarketplacesList ({
  marketplaces
}: MarketplacesListProps) {
  function getGroupedMarketplaces(_marketplaces: Network[]): GroupedMarketplace[] {
    return Object.values(_marketplaces.reduce((acc, curr) => {
      const name = curr.name.toLowerCase();
      const { logoIcon, fullLogo, colors, tokensLocked, totalIssues, totalOpenIssues, chain, networkToken, isClosed } = 
        curr;
      const hasMultipleChains = !!acc[name]?.chains?.length;

      acc[name] = {
        name,
        logoIcon: acc[name]?.logoIcon || logoIcon,
        fullLogo: acc[name]?.fullLogo || fullLogo,
        colors: acc[name]?.colors || colors,
        tokensLocked: (acc[name]?.tokensLocked || 0) + +tokensLocked,
        totalIssues: (acc[name]?.totalIssues || 0) + +totalIssues,
        totalOpenIssues: (acc[name]?.totalOpenIssues || 0) + +totalOpenIssues,
        chains: [...(acc[name]?.chains || []), chain],
        networkToken: acc[name]?.networkToken || networkToken,
        isClosed: hasMultipleChains ? acc[name]?.isClosed && isClosed : isClosed,
      }; 
      return acc;
    }, {}));
  }

  return(
    <MarketplacesListView
      groupedMarketplaces={getGroupedMarketplaces(marketplaces)}
    />
  );
}