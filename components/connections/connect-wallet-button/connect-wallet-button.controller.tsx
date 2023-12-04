import { useEffect, useState } from "react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";

export default function ConnectWalletButton({
  children = null,
  asModal = false,
  forceLogin = false,
  btnColor = "white",
}) {
  const [showModal, setShowModal] = useState(false);

  const { updateWeb3Dialog, loading } = useLoadersStore();
  const { service: daoService, serviceStarting } = useDaoStore();
  const { currentUser } = useUserStore();
  const { signInWallet } = useAuthentication();

  async function handleLogin()  {
    if(!window?.ethereum) {
      updateWeb3Dialog(true)
      return;
    }

    signInWallet();
  }

  function onWalletChange() {
    setShowModal(!currentUser?.walletAddress);
  }

  useEffect(() => {
    if (!daoService) return;

    if (forceLogin)
      signInWallet();
  }, [daoService, forceLogin]);

  useEffect(onWalletChange, [currentUser?.walletAddress]);

  return(
    <ConnectWalletButtonView
      children={children}
      asModal={asModal}
      isLoading={loading?.isLoading || serviceStarting}
      isModalVisible={showModal}
      isConnected={!!currentUser?.walletAddress}
      buttonColor={btnColor}
      onConnectClick={handleLogin}
    />
  );
}
