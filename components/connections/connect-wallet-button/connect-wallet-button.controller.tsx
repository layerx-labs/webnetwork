import { useEffect, useState } from "react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { useAppState } from "contexts/app-state";
import { changeShowWeb3 } from "contexts/reducers/update-show-prop";

import { useAuthentication } from "x-hooks/use-authentication";

export default function ConnectWalletButton({
  children = null,
  asModal = false,
  forceLogin = false,
  btnColor = "white",
}) {
  const [showModal, setShowModal] = useState(false);

  const { dispatch, state } = useAppState();
  const { signInWallet } = useAuthentication();

  async function handleLogin()  {
    if(!window?.ethereum) {
      dispatch(changeShowWeb3(true))
      return;
    }

    signInWallet();
  }

  function onWalletChange() {
    setShowModal(!state.currentUser?.walletAddress);
  }

  useEffect(() => {
    if (!state.Service?.active) return;

    if (forceLogin)
      signInWallet();
  }, [state.Service?.active, forceLogin]);

  useEffect(onWalletChange, [state.currentUser?.walletAddress]);

  return(
    <ConnectWalletButtonView
      children={children}
      asModal={asModal}
      isLoading={state?.loading?.isLoading || state.Service?.starting}
      isModalVisible={showModal}
      hasWeb3Connection={!!state.Service?.web3Connection}
      isConnected={!!state.currentUser?.walletAddress}
      buttonColor={btnColor}
      onConnectClick={handleLogin}
    />
  );
}
