import ExplorePageView from "components/pages/explore/view";

import { api } from "services/api";

import { useNetwork } from "x-hooks/use-network";

interface ExplorePageProps {
  numberOfNetworks: number;
  numberOfBounties: number;
}

function ExplorePage({
  numberOfNetworks,
  numberOfBounties,
}: ExplorePageProps) {
  const { networkName } = useNetwork();

  return (
    <ExplorePageView
      networkName={networkName}
      numberOfNetworks={numberOfNetworks}
      numberOfBounties={numberOfBounties}
    />
  );
}

async function getExplorePageData(query) {
  const { network } = query;

  const { data } = await api.get("/search/networks/total", { 
    params: {
      name: network
    }
  });

  return {
    numberOfNetworks: data
  };
}

export { ExplorePage, getExplorePageData };
