import ExplorePageView from "components/pages/explore/view";

import { ExplorePageProps } from "types/pages";

import useMarketplace from "x-hooks/use-marketplace";

export default function ExplorePage(props: ExplorePageProps) {
  const marketplace = useMarketplace();

  return (
    <ExplorePageView
      networkName={marketplace?.active?.name}
      {...props}
    />
  );
}