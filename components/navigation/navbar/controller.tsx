import {useEffect} from "react";

import {useRouter} from "next/router";

import NavBarView from "components/navigation/navbar/view";

import {useUserStore} from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import {useSettings} from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

import {baseApiImgUrl} from "../../../services/api";
import {userPointsOfUser} from "../../../x-hooks/use-points-of-user";

export default function NavBar() {
  const { pathname } = useRouter();

  const { currentUser } = useUserStore();
  const { settings } = useSettings();
  const { loadChainsDatabase } = useSupportedChain();
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const isOnNetwork = pathname?.includes("[network]");
  const logoPath = baseApiImgUrl.concat("/", settings?.urls?.ipfs);
  const logos = {
    fullLogo: activeMarketplace?.fullLogo && `${logoPath}/${activeMarketplace.fullLogo}`,
    logoIcon: activeMarketplace?.logoIcon && `${logoPath}/${activeMarketplace.logoIcon}`
  };
  const brandHref = !isOnNetwork ? "/" : getURLWithNetwork("/tasks", {
    network: activeMarketplace?.name,
  });

  const { totalPoints } = userPointsOfUser();

  useEffect(loadChainsDatabase, [])

  return (
    <NavBarView
      isOnNetwork={isOnNetwork}
      isCurrentNetworkClosed={activeMarketplace?.isClosed}
      isConnected={!!currentUser?.walletAddress}
      brandHref={brandHref}
      logos={logos}
      points={totalPoints}
    />
  );
}
