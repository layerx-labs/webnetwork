import React, { useEffect } from "react";

import { useSession } from "next-auth/react";

import NetworkThemeInjector from "components/custom-network/network-theme-injector";

import { GlobalEffectsProvider } from "./global-effects";

const RootProviders = ({ children }) => {
  const { update } = useSession();

  useEffect(() => {
    update();
  }, []);

  return (
    <GlobalEffectsProvider>
      <NetworkThemeInjector />
      {children}
    </GlobalEffectsProvider>
  );
};

export default RootProviders;
