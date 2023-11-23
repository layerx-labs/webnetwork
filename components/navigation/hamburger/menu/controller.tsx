import {useState} from "react";

import {useRouter} from "next/router";

import HamburgerMenuView from "components/navigation/hamburger/menu/view";

import {NAVIGATION_LINKS} from "helpers/navigation-links";
import {isOnNetworkPath} from "helpers/network";

import {Link} from "types/utils";

import { useUserStore } from "x-hooks/stores/user/user.store";
import {useAuthentication} from "x-hooks/use-authentication";
import useMarketplace from "x-hooks/use-marketplace";

interface MenuDrawerProps {
  show: boolean;
  onHide: () => void;
}

export default function HamburgerMenu({
  show,
  onHide
}: MenuDrawerProps) {
  const { pathname } = useRouter();
  
  const [isProfileLinksVisible, setIsProfileLinksVisible] = useState(false);
  
  const { signOut } = useAuthentication();
  const { getURLWithNetwork } = useMarketplace();
  const { currentUser } = useUserStore();

  const isOnNetwork = isOnNetworkPath(pathname);

  const { network, global, both } = NAVIGATION_LINKS;

  const links = ((isOnNetwork ? network.map(({ label, href }) => ({
    href: getURLWithNetwork(href),
    label
  })) : global) as Link[]).concat(both as Link[]);

  function handleDisconnect() {
    setIsProfileLinksVisible(false);
    onHide();
    signOut();
  }

  function handleShowProfileLinks() {
    setIsProfileLinksVisible(true);
  }

  function handleHideProfileLinks() {
    setIsProfileLinksVisible(false);
  }

  function handleHideDrawer() {
    handleHideProfileLinks();
    onHide();
  }

  return(
    <HamburgerMenuView
      show={show}
      userLogin={currentUser?.login}
      userAddress={currentUser?.walletAddress}
      isConnected={!!currentUser?.walletAddress}
      isProfileLinksVisible={isProfileLinksVisible}
      onDisconnect={handleDisconnect}
      onShowProfileLinks={handleShowProfileLinks}
      onHideProfileLinks={handleHideProfileLinks}
      onHideHamburger={handleHideDrawer}
      links={links}
    />
  );
}