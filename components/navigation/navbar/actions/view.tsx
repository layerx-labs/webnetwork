import { useTranslation } from "next-i18next";

import HelpButton from "components/common/buttons/help/view";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import CreateNetworkBountyButton from "components/create-network-bounty-button/controller";
import NavAvatar from "components/nav-avatar";
import HamburgerButton from "components/navigation/hamburger/controller";
import Notifications from "components/notifications/controller";
import ResponsiveWrapper from "components/responsive-wrapper";
import TransactionsStateIndicator from "components/transactions-state-indicator";

export default function NavBarActions() {
  const { t } = useTranslation("common");
  
  return(
    <>
      <div className="d-flex flex-row align-items-center gap-3">
        <ResponsiveWrapper
          xs={false}
          md={true}
        >
          <div className="d-flex gap-3 align-items-center">
            <CreateNetworkBountyButton />

            <Tooltip tip={t("main-nav.tips.help")}>
              <div>
                <HelpButton />
              </div>
            </Tooltip>
          </div>
        </ResponsiveWrapper>

        <ConnectWalletButton>
          <ResponsiveWrapper
            xs={false}
            md={true}
          >
            <div className="d-flex gap-3 align-items-center">
              <Tooltip tip={t("main-nav.tips.transactions-list")}>
                <div>
                  <TransactionsStateIndicator />
                </div>
              </Tooltip>

              <Tooltip tip={t("main-nav.tips.notifications-list")}>
                <div>
                  <Notifications />
                </div>
              </Tooltip>

              <NavAvatar />
            </div>
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={true}
            md={false}
          >
            <CreateNetworkBountyButton label={t("misc.bounty")}/>
          </ResponsiveWrapper>
        </ConnectWalletButton>

        <ResponsiveWrapper
            xs={true}
            md={false}
          >
            <HamburgerButton />
          </ResponsiveWrapper>
      </div>
    </>
  );
}