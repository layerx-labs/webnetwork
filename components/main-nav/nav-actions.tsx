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

  const CreateBtn = () => 
  <ReadOnlyButtonWrapper>
    {
      isOnNetwork ?
        <InternalLink
          href={"/create-bounty"}
          icon={<PlusIcon />}
          label={t("main-nav.new-bounty") as string}
          iconBefore
          uppercase
        /> :
        <MultiActionButton
          label="Create"
          className="read-only-button"
          icon={<PlusIcon />}
          actions={[
            { label: "Bounty", onClick: () => console.log("Create Bounty") },
            { label: "Network", onClick: () => console.log("Create Network") },
          ]}
        />
    }
  </ReadOnlyButtonWrapper>;

  return(
    <>
      <div className="d-flex flex-row align-items-center gap-3">
        <ResponsiveWrapper
          xs={false}
          xl={true}
        >
          <div className="d-flex gap-3">
            <CreateBtn />

            <Button
              onClick={onClickShowHelp}
              className="bg-gray-850 border-gray-850 rounded p-2"
              transparent
            >
              <HelpIcon />
            </Button>
          </div>
        </ResponsiveWrapper>

        {/* <ConnectWalletButton>
          <ResponsiveWrapper
            xs={false}
            xl={true}
          >
            <div className="d-flex gap-3">
              <TransactionsStateIndicator />

              <NavAvatar />
            </div>
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={true}
            xl={false}
          >
            <CreateBtn />
          </ResponsiveWrapper>
        </ConnectWalletButton> */}
        <CreateBtn />
      </div>
    </>
  );
}