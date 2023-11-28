import useMarketplace from "x-hooks/use-marketplace";

import DeliverableInfoCardView from "./view";

export default function DeliverableInfoCuratorCard() {
  
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const votingPowerHref = getURLWithNetwork("/profile/[[...profilePage]]");
  const marketplaceName = activeMarketplace?.name?.toLowerCase();
  const votingPowerAlias = `/${marketplaceName}/profile/voting-power`;

  return (
    <DeliverableInfoCardView
      votingPowerHref={votingPowerHref}
      votingPowerAlias={votingPowerAlias}
    />
  );
}