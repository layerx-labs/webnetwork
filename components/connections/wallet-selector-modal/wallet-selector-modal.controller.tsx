import WalletSelectorModalView from "components/connections/wallet-selector-modal/wallet-selector-modal.view";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useSettings } from "x-hooks/use-settings";

export default function WalletSelectorModal () {
  const { settings } = useSettings();
  const { signInWallet } = useAuthentication();

  const { walletSelectorModal, updateWalletSelectorModal } = useLoadersStore();

  function onCloseClick () {
    updateWalletSelectorModal(false);
  }

  return (
    <WalletSelectorModalView
      show={walletSelectorModal}
      availableWallets={settings?.availableWallets || ["Metamask"]}
      onCloseClick={onCloseClick}
      onConnectorConnect={signInWallet}
      onConnectorDisconnect={console.log}
    />
  );
}