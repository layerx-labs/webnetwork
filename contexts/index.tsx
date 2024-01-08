import React, { useEffect } from "react";

import { useSession } from "next-auth/react";

import NetworkThemeInjector from "components/custom-network/network-theme-injector";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useDao } from "x-hooks/use-dao";
import { useSettings } from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

const RootProviders = ({ children }) => {
  const session = useSession();
  const { loadSettings } = useSettings();
  const { service: daoService } = useDaoStore();
  const { currentUser } = useUserStore();
  const { supportedChains } = useSupportedChain();
  const { listenChainChanged } = useDao();
  const { syncUserDataWithSession, updateWalletBalance, verifyReAuthorizationNeed } = useAuthentication();

  useEffect(() => {
    loadSettings()
  }, []);

  useEffect(() => {
    if (currentUser?.connected)
      session.update();
  }, [currentUser?.connected]);

  useEffect(() => {
    syncUserDataWithSession();
  }, [daoService, session]);

  useEffect(listenChainChanged, [supportedChains]);

  useEffect(updateWalletBalance, [currentUser?.walletAddress, daoService?.network?.contractAddress]);

  useEffect(verifyReAuthorizationNeed, [currentUser?.walletAddress]);

  return (
    <>
      <NetworkThemeInjector/>
      {children}
    </>
  );
};

export default RootProviders;
