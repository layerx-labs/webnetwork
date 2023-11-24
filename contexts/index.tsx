import React, { useEffect } from "react";

import { useSession } from "next-auth/react";

import NetworkThemeInjector from "components/custom-network/network-theme-injector";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useSettings } from "x-hooks/use-settings";

import { GlobalEffectsProvider } from "./global-effects";

const RootProviders = ({ children }) => {
  const session = useSession();
  const { loadSettings } = useSettings();
  const { service: daoService } = useDaoStore();
  const { syncUserDataWithSession } = useAuthentication();
  
  useEffect(() => {
    session.update();
  }, []);

  useEffect(loadSettings, []);

  useEffect(() => {
    syncUserDataWithSession();
  }, [daoService, session]);

  return (
    <GlobalEffectsProvider>
      <NetworkThemeInjector />
      {children}
    </GlobalEffectsProvider>
  );
};

export default RootProviders;
