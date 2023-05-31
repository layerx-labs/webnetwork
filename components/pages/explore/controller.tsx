import ExplorePageView from "components/pages/explore/view";

import { useNetwork } from "x-hooks/use-network";

interface ExplorePageProps {
  numberOfNetworks: number;
  numberOfBounties: number;
}

export default function ExplorePage({
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