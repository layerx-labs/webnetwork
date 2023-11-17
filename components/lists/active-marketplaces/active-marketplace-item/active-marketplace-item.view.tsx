import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import Link from "next/link";

import ChainIcon from "components/chain-icon";
import { OverlappingIcons } from "components/common/overlapping-icons/overlapping-icons.view";
import { 
  ActiveMarketplaceChainsModal 
} from "components/lists/active-marketplaces/active-marketplaces-chains-modal/chains-modals.view";
import NetworkLogo from "components/network-logo";

import { formatNumberToNScale } from "helpers/formatNumber";

import { ActiveMarketplace } from "types/api";

import If from "../../../If";
import InfoTooltip from "../../../info-tooltip";

const { publicRuntimeConfig } = getConfig();

interface ActiveMarketplaceItemProps {
  marketplace: ActiveMarketplace;
  isChainsModalVisible: boolean;
  href: string;
  onMoreClick: (e) => void;
  onCloseClick: () => void;
}

export function ActiveMarketplaceItemView({
  marketplace,
  isChainsModalVisible,
  href,
  onMoreClick,
  onCloseClick,
}: ActiveMarketplaceItemProps) {
  const { t } = useTranslation("bounty");

  const amountClasses = 
    "col-auto bg-gray-850 p-1 px-2 border-radius-4 border border-gray-800 sm-regular lh-1 font-weight-normal";

  return (
    <>
      <Link href={href} passHref>
        <div className="cursor-pointer border border-gray-800 border-radius-8 bg-gray-900 p-3 bg-gray-950-hover">
          <div className="row align-items-center justify-content-between mx-0">
            <div className="col-auto px-0">
              <div className="row align-items-center">
                <div className="col-auto">
                  <NetworkLogo
                    src={`${publicRuntimeConfig?.urls?.ipfs}/${marketplace?.logoIcon}`}
                    size="sm"
                    shape="square"
                    bgColor="gray-850"
                  />
                </div>
                <div className="col-auto px-0">
                  <span className="sm-regular font-weight-medium text-white text-capitalize">
                    {marketplace?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-auto px-0">
              <OverlappingIcons
                icons={marketplace?.chains?.map((chain) => (
                  <ChainIcon src={chain?.icon} size="22" />
                ))}
                onMoreClick={onMoreClick}
              />
            </div>
          </div>

          <div className="row align-items-center mx-0 gap-3 mt-4">
            <div className={amountClasses}>
              {marketplace?.totalIssues || 0}{" "}
              <span className="text-capitalize text-gray-500">
                {t("label", { count: marketplace?.totalIssues || 0 })}
              </span>
            </div>

            <div className={amountClasses}>
              <div className="d-flex align-items-center gap-1">
                <span>
                  {marketplace?.hasNotConverted ? "~ ": ""}
                  {formatNumberToNScale(marketplace?.totalValueLock || 0, 0)}
                </span>
                <span className="text-uppercase text-gray-500">{publicRuntimeConfig?.mainCurrency}</span>
                <If condition={marketplace?.hasNotConverted}>
                  <InfoTooltip
                    description={t("tokens-not-converted")}
                  />
                </If>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <ActiveMarketplaceChainsModal
        show={isChainsModalVisible}
        chains={marketplace?.chains}
        onCloseClick={onCloseClick}
      />
    </>
  );
}
