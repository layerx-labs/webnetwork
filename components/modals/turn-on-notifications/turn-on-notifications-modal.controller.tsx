import { TurnOnNotificationsModalView } from "components/modals/turn-on-notifications/turn-on-notifications-modal.view";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import useMarketplace from "x-hooks/use-marketplace";

export function TurnOnNotificationsModal() {
  const { goToProfilePage } = useMarketplace();
  const { turnOnNotificationsModalReason, updateTurnOnNotificationsModalReason } = useLoadersStore();

  function onCloseClick() {
    updateTurnOnNotificationsModalReason(null);
  }

  function goToDashboard() {
    goToProfilePage("dashboard");
    onCloseClick();
  }

  return(
    <TurnOnNotificationsModalView
      reason={turnOnNotificationsModalReason}
      show={!!turnOnNotificationsModalReason}
      onCloseClick={onCloseClick}
      goToDashboard={goToDashboard}
    />
  );
}