import clsx from "clsx";
import { UrlObject } from "url";

import ClosedNetworkAlert from "components/closed-network-alert";
import BrandLogo from "components/common/brand-logo/view";
import NavActions from "components/main-nav/nav-actions";
import NavLinks from "components/main-nav/nav-links";
import ChainSelector from "components/navigation/chain-selector/controller";
import ResponsiveWrapper from "components/responsive-wrapper";

interface NavBarViewProps {
  isOnNetwork: boolean;
  isCurrentNetworkClosed: boolean;
  isConnected: boolean;
  brandHref: string | UrlObject;
  logoUrl: string;
}

export default function NavBarView({
  isOnNetwork,
  isCurrentNetworkClosed,
  isConnected,
  brandHref,
  logoUrl,
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
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex gap-3">
              <BrandLogo
                href={brandHref}
                logoUrl={logoUrl}
                showDefaultBepro={!isOnNetwork}
              />

              <ResponsiveWrapper xs={false} xl={true}>
                <ChainSelector />
              </ResponsiveWrapper>
            </div>

            <NavLinks />
          </div>

          <NavActions />
        </div>
      </div>
    </div>
  );
}
