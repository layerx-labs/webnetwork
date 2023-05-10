import { useTranslation } from "next-i18next";

import HelpIcon from "assets/icons/help-icon";
import PlusIcon from "assets/icons/plus-icon";

import Button from "components/button";
import ConnectWalletButton from "components/connect-wallet-button";
import ContractButton from "components/contract-button";
import InternalLink from "components/internal-link";
import { MyNetworkLink } from "components/main-nav";
import MultiActionButton from "components/multi-action-button";
import NavAvatar from "components/nav-avatar";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import ResponsiveWrapper from "components/responsive-wrapper";
import TransactionsStateIndicator from "components/transactions-state-indicator";

interface NavActionsProps {
  onClickCreateBounty: () => void;
  onClickShowHelp: () => void;
  isOnNetwork: boolean;
  myNetworkLink: MyNetworkLink;
}

export default function NavActions({
  onClickCreateBounty,
  isOnNetwork,
  onClickShowHelp,
  myNetworkLink
} : NavActionsProps) {
  const { t } = useTranslation("common");

  return(
    <>
      <ResponsiveWrapper
        xs={false}
        xl={true}
      >
        <div className="flex-row align-items-center gap-3">
          <ReadOnlyButtonWrapper>
            <ContractButton
              onClick={onClickCreateBounty}
              textClass="text-white"
              className="read-only-button"
            >
              <PlusIcon />
              <span>{t("main-nav.new-bounty")}</span>
            </ContractButton>
          </ReadOnlyButtonWrapper>
          
          {/* {!isOnNetwork && (
            <InternalLink
              href={myNetworkLink.href}
              icon={myNetworkLink.icon}
              label={myNetworkLink.label}
              iconBefore
              uppercase
              outline
            />
          )} */}

          <Button
            onClick={onClickShowHelp}
            className="bg-gray-850 border-gray-850 rounded p-2"
            transparent
          >
            <HelpIcon />
          </Button>

          <ConnectWalletButton>
            <TransactionsStateIndicator />

            <NavAvatar />
          </ConnectWalletButton>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper
        xl={false}
      >
        <div className="d-flex align-items-center d-xl-none">
          <MultiActionButton
            label="Create"
            actions={[
              { label: "Bounty", onClick: () => console.log("Create Bounty") },
              { label: "Network", onClick: () => console.log("Create Network") },
            ]}
          />
        </div>
      </ResponsiveWrapper>
    </>
  );
}