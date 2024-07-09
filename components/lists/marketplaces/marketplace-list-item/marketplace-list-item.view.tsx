import {useTranslation} from "next-i18next";
import Link from "next/link";

import ChainIcon from "components/chain-icon";
import {OverlappingIcons} from "components/common/overlapping-icons/overlapping-icons.view";
import ResponsiveListItem from "components/common/responsive-list-item/view";
import {GroupedMarketplace} from "components/lists/marketplaces/marketplaces-list.view"
import NetworkLogo from "components/network-logo";

import {formatNumberToNScale} from "helpers/formatNumber";

import {useSettings} from "x-hooks/use-settings";

import {baseApiImgUrl} from "../../../../services/api";

type MarketplaceListItemProps = {
  marketplace: GroupedMarketplace
};

export function MarketplaceListItem({
  marketplace
}: MarketplaceListItemProps) {
  const { t } = useTranslation(["common", "custom-network"]);
  
  const { settings } = useSettings();

  const chainsIcons = marketplace?.isClosed ? 
    <span className={`xs-small font-weight-normal text-white border border-gray-800 border-radius-4 py-1 px-2 
      text-uppercase`}>
      {t("misc.closed")}
    </span> : 
    <OverlappingIcons
      icons={marketplace?.chains?.map(chain => (
        <ChainIcon src={chain?.icon} size="22" />
      ))}
    />;

  const columns = [
    {
      label: t("custom-network:networks"),
      secondaryLabel: chainsIcons,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("custom-network:open-bounties"),
      secondaryLabel: marketplace?.totalOpenIssues,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("custom-network:total-bounties"),
      secondaryLabel: marketplace?.totalIssues,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("custom-network:tokens-locked"),
      secondaryLabel: <div>
        {formatNumberToNScale(marketplace?.tokensLocked, 0, "")}{" "}
        <span className="text-purple">{marketplace?.networkToken?.symbol}</span>
      </div>,
      breakpoints: { xs: false, xl: true },
      justify: "center"
    },
    {
      secondaryLabel: 
      <div className="bg-gray-950 border border-gray-800 py-1 px-2 xs-small font-weight-normal border-radius-4">
        <span className="text-white">{marketplace?.totalOpenIssues} </span>
        <span className="text-gray-500">Open Tasks</span>
      </div>,
      breakpoints: { xs: false },
      justify: "center"
    },
  ];
  
  return(
    <Link href={`${marketplace?.name?.toLowerCase()}/tasks`}>
      <ResponsiveListItem
        icon={
          <NetworkLogo 
            src={`${baseApiImgUrl}/${settings?.urls?.ipfs}/${marketplace?.logoIcon}`}
            shape="square"
            size="lg"
            noBg 
          />
        }
        label={marketplace?.name}
        columns={columns}
        mobileColumnIndex={4}
        mobileMainColumn={chainsIcons}
        className={marketplace?.isClosed ? "opacity-75 bg-gray-900" : ""}
      />
    </Link>
  );
}