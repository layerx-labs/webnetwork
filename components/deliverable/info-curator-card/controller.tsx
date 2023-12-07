import DeliverableInfoCardView from "./view";

export default function DeliverableInfoCuratorCard() {
  return (
    <DeliverableInfoCardView
      votingPowerHref="/profile/[[...profilePage]]"
      votingPowerAlias="/profile/voting-power"
    />
  );
}