import clsx from "clsx";
import {UrlObject} from "url";

import ClosedNetworkAlert from "components/closed-network-alert";
import BrandLogo from "components/common/brand-logo/view";
import NavBarActions from "components/navigation/navbar/actions/view";
import NavBarLinks from "components/navigation/navbar/links/view";
import {ResponsiveEle} from "components/responsive-wrapper";

interface NavBarViewProps {
  isOnNetwork: boolean;
  isCurrentNetworkClosed: boolean;
  isConnected: boolean;
  brandHref: string | UrlObject;
  logos: { fullLogo: string; logoIcon: string; }
}

export default function NavBarView({
  isOnNetwork,
  isCurrentNetworkClosed,
  isConnected,
  brandHref,
  logos,
}: NavBarViewProps) {
  const isClosedAlertVisible = isOnNetwork && isCurrentNetworkClosed;
  const paddingY = isConnected ? "py-0" : "py-3";

  return (
    <div className="nav-container">
      <ClosedNetworkAlert
        isVisible={isClosedAlertVisible}
      />

      <div className="main-nav d-flex flex-column justify-content-center">
        <div
          className={clsx([
            "d-flex flex-row align-items-center justify-content-between px-3",
            paddingY
          ])}
        >
          <div className="d-flex align-items-center nav-gap">
            <div className="d-flex gap-32">
              <ResponsiveEle 
                mobileView={<BrandLogo href={brandHref} logoUrl={logos.fullLogo} showDefaultBepro={!isOnNetwork}/>}
                tabletView={<BrandLogo href={brandHref} logoUrl={logos.logoIcon} showDefaultBepro={!isOnNetwork}/>}
              />
            </div>

            <NavBarLinks />
          </div>

          <NavBarActions />
        </div>
      </div>
    </div>
  );
}
