import { useDappkit } from "@layerx-labs/dappkit-react";

import WalletMismatchModalView from "components/modals/wallet-mismatch/wallet-mismatch-modal.view";

import { truncateAddress } from "helpers/truncate-address";
import { getProviderNameFromConnection } from "helpers/wallet-providers";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";

export default function WalletMismatchModal() {
  const { connection } = useDappkit();

  const { currentUser } = useUserStore();
  const { walletMismatchModal: show, updateWalletMismatchModal } = useLoadersStore();

  const truncatedWallet = truncateAddress(currentUser?.walletAddress);
  const walletExtensionName = getProviderNameFromConnection(connection).toLowerCase();
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