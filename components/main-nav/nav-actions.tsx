import ConnectWalletButton from "components/connect-wallet-button";
import CreateNetworkBountyButton from "components/create-network-bounty-button/controller";
import HelpButton from "components/main-nav/help-button";
import MobileMenu from "components/mobile-menu";
import NavAvatar from "components/nav-avatar";
import ResponsiveWrapper from "components/responsive-wrapper";
import TransactionsStateIndicator from "components/transactions-state-indicator";

export default function NavActions() {
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

              <NavAvatar />
            </div>
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={true}
            xl={false}
          >
            <CreateNetworkBountyButton />
          </ResponsiveWrapper>
        </ConnectWalletButton>

        <ResponsiveWrapper
            xs={true}
            xl={false}
          >
            <MobileMenu />
          </ResponsiveWrapper>
      </div>
    </>
  );
}