import { useEffect, useState } from "react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";

export default function ConnectWalletButton({
  children = null,
  asModal = false,
  btnColor = "white",
}) {
  const [showModal, setShowModal] = useState(false);

  const { currentUser } = useUserStore();
  const { serviceStarting } = useDaoStore();
  const { updateWeb3Dialog, updateWalletSelectorModal, loading } = useLoadersStore();

  async function onConnectClick()  {
    if(!window?.ethereum) {
      updateWeb3Dialog(true);
      return;
    }

    updateWalletSelectorModal(true);
  }

  function onWalletChange() {
    setShowModal(!currentUser?.walletAddress);
  }

  useEffect(onWalletChange, [currentUser?.walletAddress]);

  return(
    <ConnectWalletButtonView
      children={children}
      asModal={asModal}
      isLoading={loading?.isLoading || serviceStarting}
      isModalVisible={showModal}
      isConnected={!!currentUser?.walletAddress}
      buttonColor={btnColor}
      onConnectClick={onConnectClick}
    />
  );
}
