import { useAccount } from "wagmi";

import WalletMismatchModalView from "components/modals/wallet-mismatch/wallet-mismatch-modal.view";

import { truncateAddress } from "helpers/truncate-address";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";

export default function WalletMismatchModal() {
  const account = useAccount();

  const { currentUser } = useUserStore();
  const { walletMismatchModal: show, updateWalletMismatchModal } = useLoadersStore();

  const truncatedWallet = truncateAddress(currentUser?.walletAddress);
  const walletExtensionName = account?.connector?.name?.toLowerCase()?.replaceAll(" ", "-");

  function onClose () {
    updateWalletMismatchModal(false);
  }

  return (
    <WalletMismatchModalView
      show={show}
      walletExtensionName={walletExtensionName}
      walletAddress={truncatedWallet}
      onCloseClick={onClose}
    />
  );
}