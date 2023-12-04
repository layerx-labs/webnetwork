import { ReactNode, useState } from "react";

import { useRouter } from "next/router";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useBreakPoint from "x-hooks/use-breakpoint";
import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";

import NetworkItemView from "./view";
interface NetworkItemProps {
  children?: ReactNode;
  key?: number | string;
  type?: "network" | "voting" | "payments";
  networkChain?: string;
  networkName: string;
  subNetworkText?: string;
  primaryColor?: string;
  iconNetwork: string | ReactNode;
  amount: string | number;
  symbol: string;
  handleNetworkLink?: () => void;
  variant?: "network" | "multi-network";
  handleToggleTabletAndMobile?: () => void;
}

export default function NetworkItem({
  key,
  children,
  type,
  amount,
  symbol,
  handleNetworkLink,
  iconNetwork,
  networkName,
  networkChain,
  subNetworkText,
  primaryColor,
  variant = "network",
  handleToggleTabletAndMobile
}: NetworkItemProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);


  const { settings } = useSettings();
  const { currentUser } = useUserStore();
  const { query } = useRouter();
  const { goToProfilePage } = useMarketplace();
  const { isDesktopView } = useBreakPoint();

  const isNetworkVariant = variant === "network";
  const isNetworkType = ["network", "payments"].includes(type);

  function toggleCollapse() {
    if(handleToggleTabletAndMobile && query?.profilePage[0] === 'voting-power' && !isDesktopView){
      handleToggleTabletAndMobile()
    } else if (isNetworkType && !isDesktopView) {
      goToProfilePage("payments", {
        networkName,
        networkChain,
        wallet: currentUser?.walletAddress
      });
    } else setIsCollapsed((previous) => !previous);
  }

  return (
    <NetworkItemView
      key={key}
      networkName={networkName}
      iconNetwork={iconNetwork}
      amount={amount}
      symbol={symbol}
      isNetworkVariant={isNetworkVariant}
      isNetworkType={isNetworkType}
      isCollapsed={isCollapsed}
      handleToggleCollapse={toggleCollapse}
      srcLogo={`${settings?.urls?.ipfs}/${iconNetwork}`}
      type={type}
      subNetworkText={subNetworkText}
      primaryColor={primaryColor}
      handleNetworkLink={handleNetworkLink}
    >
      {children}
    </NetworkItemView>
  );
}
