import React, { useEffect } from "react";

import { useSession } from "next-auth/react";

import NetworkThemeInjector from "components/custom-network/network-theme-injector";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

const RootProviders = ({ children }) => {
  const session = useSession();
  const { loadSettings } = useSettings();
  const { service: daoService } = useDaoStore();
  const { currentUser } = useUserStore();
  const { supportedChains, connectedChain } = useSupportedChain();
  const marketplace = useMarketplace();
  const { listenChainChanged, changeNetwork, start: daoServiceStart } = useDao();
  const { syncUserDataWithSession, updateWalletBalance, verifyReAuthorizationNeed } = useAuthentication();
  
  useEffect(() => {
    session.update();
    loadSettings()
  }, []);

  useEffect(() => {
    syncUserDataWithSession();
  }, [daoService, session]);

  useEffect(listenChainChanged, [ supportedChains ]);

  useEffect(() => {
    daoServiceStart()
  }, [
    marketplace?.active?.chain_id,
    connectedChain?.id,
    connectedChain?.registry,
    currentUser?.connected
  ]);

  useEffect(() => {
    changeNetwork();
  }, [
    daoService,
    marketplace?.active?.networkAddress,
    marketplace?.active?.chain_id,
  ]);

  
  useEffect(updateWalletBalance, [currentUser?.walletAddress, daoService?.network?.contractAddress]);

  useEffect(verifyReAuthorizationNeed, [currentUser?.walletAddress]);

  return (
    <>
      <NetworkThemeInjector />
      {children}
    </>
  );
};

export default RootProviders;
