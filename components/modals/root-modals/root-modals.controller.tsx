import WalletSelectorModal from "components/connections/wallet-selector-modal/wallet-selector-modal.controller";
import InvalidAccountWalletModal from "components/invalid-account-wallet-modal";
import NoWalletModal from "components/modals/no-wallet-modal/no-wallet-modal.controller";
import WalletMismatchModal from "components/modals/wallet-mismatch/controller";
import WrongNetworkModal from "components/modals/wrong-network-modal/wrong-network-modal.controller";

export default function RootModals() {
  return(
    <>
      <NoWalletModal />
      <InvalidAccountWalletModal />
      <WrongNetworkModal />
      <WalletMismatchModal />
      <WalletSelectorModal />
    </>
  );
}