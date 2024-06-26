import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import NetworkThemeInjector from "components/custom-network/network-theme-injector";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

const RootProviders = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  const { chainId } = useAccount();

  const { updateChain } = useDao();
  const { loadSettings } = useSettings();
  const { clear, refresh } = useMarketplace();
  const { supportedChains } = useSupportedChain();
  const { syncUserDataWithSession, updateWalletBalance } = useAuthentication();

  const { currentUser } = useUserStore();
  const { service: daoService } = useDaoStore();

  useEffect(() => {
    if (router?.pathname?.includes("[network]") || router?.asPath?.includes("dashboard/my-marketplace") || 
      router?.pathname?.includes("create-task")) return;
    clear();
    refresh();
  }, [router?.pathname]);

  useEffect(() => {
    loadSettings()
  }, []);

  useEffect(() => {
    if ((window?.ethereum as any)?.selectedProvider)
      (window.ethereum as any).selectedProvider = null;
  }, []);

  useEffect(() => {
    if (!chainId || !supportedChains)
      return;
    updateChain(+chainId);
  }, [chainId, supportedChains]);

  useEffect(() => {
    if (currentUser?.connected)
      session.update();
  }, [currentUser?.connected]);

  useEffect(() => {
    syncUserDataWithSession();
  }, [daoService, session]);

  useEffect(updateWalletBalance, [currentUser?.walletAddress, daoService?.network?.contractAddress]);

  return (
    <>
      <NetworkThemeInjector/>
      {children}
    </>
  );
};

export default RootProviders;
