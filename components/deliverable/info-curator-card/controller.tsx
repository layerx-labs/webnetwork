import DeliverableInfoCardView from "./view";

export default function DeliverableInfoCuratorCard() {
  return (
    <DeliverableInfoCardView
      votingPowerHref="/dashboard/[[...dashboardPage]]"
      votingPowerAlias="/dashboard/voting-power"
    />
  );
}