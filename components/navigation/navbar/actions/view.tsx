import { useTranslation } from "next-i18next";

import HelpButton from "components/common/buttons/help/view";
import NotificationButton from "components/common/buttons/notification/view";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import CreateNetworkBountyButton from "components/create-network-bounty-button/controller";
import NavAvatar from "components/nav-avatar";
import HamburgerButton from "components/navigation/hamburger/controller";
import ResponsiveWrapper from "components/responsive-wrapper";
import TransactionsStateIndicator from "components/transactions-state-indicator";

export default function NavBarActions() {
  const { t } = useTranslation("common");
  
  return(
    <>
      <div className="d-flex flex-row align-items-center gap-3">
        <ResponsiveWrapper
          xs={false}
          xl={true}
        >
          <div className="d-flex gap-3 align-items-center">
            <CreateNetworkBountyButton />

            <HelpButton />
          </div>
        </ResponsiveWrapper>

        <ConnectWalletButton>
          <ResponsiveWrapper
            xs={false}
            xl={true}
          >
            <div className="d-flex gap-3 align-items-center">
              <TransactionsStateIndicator />
              <NotificationButton />
              <NavAvatar />
            </div>
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={true}
            xl={false}
          >
            <CreateNetworkBountyButton label={t("misc.bounty")}/>
          </ResponsiveWrapper>
        </ConnectWalletButton>

        <ResponsiveWrapper
            xs={true}
            xl={false}
          >
            <HamburgerButton />
          </ResponsiveWrapper>
      </div>
    </>
  );
}