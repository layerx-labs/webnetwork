import { useEffect } from "react";

import {useRouter} from "next/router";

import NavBarView from "components/navigation/navbar/view";

import {useAppState} from "contexts/app-state";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function NavBar() {
  const { pathname } = useRouter();

  const { state } = useAppState();
  const { currentUser } = useUserStore();
  const { loadChainsDatabase } = useSupportedChain();
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const isOnNetwork = pathname?.includes("[network]");
  const logoPath = state.Settings?.urls?.ipfs;
  const logos = {
    fullLogo: activeMarketplace?.fullLogo && `${logoPath}/${activeMarketplace.fullLogo}`,
    logoIcon: activeMarketplace?.logoIcon && `${logoPath}/${activeMarketplace.logoIcon}` 
  };
  const brandHref = !isOnNetwork ? "/" : getURLWithNetwork("/", {
    network: activeMarketplace?.name,
  });

  useEffect(loadChainsDatabase, [])

  return (
    <NavBarView
      isOnNetwork={isOnNetwork}
      isCurrentNetworkClosed={activeMarketplace?.isClosed}
      isConnected={!!currentUser?.walletAddress}
      brandHref={brandHref}
      logos={logos}
    />
  );
}
