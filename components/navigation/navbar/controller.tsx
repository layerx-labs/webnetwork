import {useRouter} from "next/router";

import NavBarView from "components/navigation/navbar/view";

import {useAppState} from "contexts/app-state";

import {useNetwork} from "x-hooks/use-network";

export default function NavBar() {
  const { pathname } = useRouter();

  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();

  const isOnNetwork = pathname?.includes("[network]");
  const network = state.Service?.network?.active;
  const logoPath = state.Settings?.urls?.ipfs
  const logos = {
    fullLogo: network?.fullLogo && `${logoPath}/${network.fullLogo}` ,
    logoIcon: network?.logoIcon && `${logoPath}/${network.logoIcon}` 
  }
  const brandHref = !isOnNetwork ? "/" : getURLWithNetwork("/", {
    network: state.Service?.network?.active?.name,
  });

  return (
    <NavBarView
      isOnNetwork={isOnNetwork}
      isCurrentNetworkClosed={state.Service?.network?.active?.isClosed}
      isConnected={!!state.currentUser?.walletAddress}
      brandHref={brandHref}
      logos={logos}
    />
  );
}
