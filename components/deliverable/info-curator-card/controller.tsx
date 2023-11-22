import useMarketplace from "x-hooks/use-marketplace";

import DeliverableInfoCardView from "./view";

export default function DeliverableInfoCuratorCard() {
  
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const votingPowerHref = getURLWithNetwork("/profile/[[...profilePage]]");
  const marketplaceName = activeMarketplace?.name?.toLowerCase();
  const chainName = activeMarketplace?.chain?.chainShortName?.toLowerCase();
  const votingPowerAlias = `/${marketplaceName}/${chainName}/profile/voting-power`;

  return (
    <DeliverableInfoCardView
      votingPowerHref={votingPowerHref}
      votingPowerAlias={votingPowerAlias}
    />
  );
}