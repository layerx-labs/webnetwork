import InvalidAccountWalletModal from "components/invalid-account-wallet-modal";
import WalletMismatchModal from "components/modals/wallet-mismatch/wallet-mismatch-modal.controller";
import WrongNetworkModal from "components/modals/wrong-network-modal/wrong-network-modal.controller";

export default function RootModals() {
  return(
    <>
      <InvalidAccountWalletModal />
      <WrongNetworkModal />
      <WalletMismatchModal />
    </>
  );
}