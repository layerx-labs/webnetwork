import InvalidAccountWalletModal from "components/invalid-account-wallet-modal";
import { NewFeatureModal } from "components/modals/new-feature-modal/new-feature-modal.controller";
import { TurnOnNotificationsModal } 
  from "components/modals/turn-on-notifications/turn-on-notifications-modal.controller";
import WalletMismatchModal from "components/modals/wallet-mismatch/wallet-mismatch-modal.controller";
import WrongNetworkModal from "components/modals/wrong-network-modal/wrong-network-modal.controller";

export default function RootModals() {
  return(
    <>
      <InvalidAccountWalletModal />
      <WrongNetworkModal />
      <WalletMismatchModal />
      <NewFeatureModal />
      <TurnOnNotificationsModal />
    </>
  );
}