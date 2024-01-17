import { useEffect, useState } from "react";

import WalletSelectorModalView from "components/connections/wallet-selector-modal/wallet-selector-modal.view";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useSettings } from "x-hooks/use-settings";

export default function WalletSelectorModal () {
  const [currentChainId, setCurrentChainId] = useState<number>();

  const { settings } = useSettings();
  const { signInWallet } = useAuthentication();

  const { walletSelectorModal, updateWalletSelectorModal } = useLoadersStore();

  function onCloseClick () {
    updateWalletSelectorModal(false);
  }

  useEffect(() => {
    if (!window.ethereum) return;
    const provider = (window?.ethereum as any)?.providers ?
      (window?.ethereum as any)?.providers?.find(p => p.isMetaMask) : window.ethereum;
    setCurrentChainId(+provider.chainId);
  }, []);

  return (
    <WalletSelectorModalView
      show={walletSelectorModal}
      defaultChainId={currentChainId}
      availableWallets={settings?.availableWallets || ["Metamask"]}
      onCloseClick={onCloseClick}
      onConnectorConnect={signInWallet}
      onConnectorDisconnect={console.log}
    />
  );
}