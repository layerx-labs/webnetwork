import { useEffect, useState } from "react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { useAppState } from "contexts/app-state";
import { changeShowWeb3 } from "contexts/reducers/update-show-prop";

import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useAuthentication } from "x-hooks/use-authentication";

export default function ConnectWalletButton({
  children = null,
  asModal = false,
  forceLogin = false,
  btnColor = "white",
}) {
  const [showModal, setShowModal] = useState(false);

  const { dispatch, state } = useAppState();
  const { service: daoService, serviceStarting } = useDaoStore();
  const { currentUser } = useUserStore();
  const { signInWallet } = useAuthentication();

  async function handleLogin()  {
    if(!window?.ethereum) {
      dispatch(changeShowWeb3(true));
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
      isLoading={state?.loading?.isLoading || serviceStarting}
      isModalVisible={showModal}
      isConnected={!!currentUser?.walletAddress}
      buttonColor={btnColor}
      onConnectClick={handleLogin}
    />
  );
}
