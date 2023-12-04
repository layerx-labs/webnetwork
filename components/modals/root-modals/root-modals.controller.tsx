import InvalidAccountWalletModal from "components/invalid-account-wallet-modal";
import MissingMetamaskModal from "components/missing-metamask-modal/controller";
import WalletMismatchModal from "components/modals/wallet-mismatch/controller";
import NoMetamaskModal from "components/no-metamask-modal/controller";
import WrongNetworkModal from "components/wrong-network-modal";

export default function RootModals() {
  return(
    <>
      <NoMetamaskModal />
      <InvalidAccountWalletModal />
      <MissingMetamaskModal />
      <WrongNetworkModal />
      <WalletMismatchModal />
    </>
  );
}