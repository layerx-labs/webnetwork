import {useTranslation} from "next-i18next";

import HelpButton from "components/common/buttons/help/view";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import CreateNetworkBountyButton from "components/create-network-bounty-button/controller";
import NavAvatar from "components/nav-avatar";
import HamburgerButton from "components/navigation/hamburger/controller";
import Notifications from "components/notifications/controller";
import {ResponsiveEle} from "components/responsive-wrapper";
import TransactionsStateIndicator from "components/transactions-state-indicator";

export default function NavBarActions() {
  const { t } = useTranslation("common");
  
  return(
    <>
      <div className="d-flex flex-row align-items-center gap-3">
        <ResponsiveEle 
          mobileView={null}
          tabletView={
            <div className="d-flex gap-3 align-items-center">
              <CreateNetworkBountyButton/>

              <Tooltip tip={t("main-nav.tips.help")}>
                <div>
                  <HelpButton />
                </div>
              </Tooltip>
            </div>
          }
        />

        <ConnectWalletButton>
          <ResponsiveEle 
            mobileView={<CreateNetworkBountyButton label={t("misc.bounty")}/>}
            tabletView={
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

                <NavAvatar/>
              </div>
            }
          />
        </ConnectWalletButton>

        <ResponsiveEle mobileView={<HamburgerButton />} tabletView={null} />
      </div>
    </>
  );
}