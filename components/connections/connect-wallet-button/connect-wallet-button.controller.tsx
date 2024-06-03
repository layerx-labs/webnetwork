import { useEffect, useState } from "react";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";

export default function ConnectWalletButton({
  children = null,
  asModal = false,
  btnColor = "white",
}) {
  const { openConnectModal } = useConnectModal();

  const [showModal, setShowModal] = useState(false);

  const { loading, updateWaitingForMessageSign } = useLoadersStore();
  const { currentUser } = useUserStore();
  const { serviceStarting } = useDaoStore();

  function onWalletChange() {
    setShowModal(!currentUser?.walletAddress);
  }

  function onConnectClick() {
    updateWaitingForMessageSign(true);
    openConnectModal?.();
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
