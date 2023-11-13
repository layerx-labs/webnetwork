import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import Link from 'next/link';

import ChainBadge from "components/chain-badge";
import ChainIcon from "components/chain-icon";
import If from "components/If";
import NetworkLogo from "components/network-logo";

import { formatNumberToNScale } from "helpers/formatNumber";

import { ActiveNetwork } from "types/api";

import useMarketplace from "x-hooks/use-marketplace";

const { publicRuntimeConfig } = getConfig();

interface ListActiveNetworksItemProps {
  network: ActiveNetwork;
}

export default function ListActiveNetworksItem({
  network
} : ListActiveNetworksItemProps) {
  const { t } = useTranslation("bounty");

  const { getURLWithNetwork } = useMarketplace();

  return(
    <Link
      href={getURLWithNetwork("/", {
        network: network?.name
      })}
    >
      <div className={`cursor-pointer border border-gray-800 border-radius-8 bg-gray-900 p-3`}>
        <div className="row align-items-center justify-content-between mx-0">
          <div className="col-auto px-0">
            <div className="row align-items-center">
              <div className="col-auto">
                <NetworkLogo
                  src={`${publicRuntimeConfig?.urls?.ipfs}/${network?.logoIcon}`}
                  size="sm"
                  shape="square"
                  bgColor="gray-850"
                />
              </div>
              <div className="col-auto px-0">
                <span className="sm-regular font-weight-medium text-white text-capitalize">
                  {network?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="col-auto px-0">
            <div className="d-flex align-items-center">
              {network?.chains?.map(chain => 
                <ChainIcon 
                  src={chain?.icon}
                  size="18"
                  className="bg-gray-850 border border-gray-800"
                />)}
            </div>
          </div>
        </div>
        {/* <div className="row align-items-center gx-5">
            <div className="col-2">
              <If condition={!!network?.logoIcon}>
                <img
                  src={`${publicRuntimeConfig?.urls?.ipfs}/${network?.logoIcon}`}
                  width={40}
                  height={40}
                />
              </If>
            </div>

            <div className="col-10">
              <div className="d-flex flex-row justify-content-between align-items-center gap-3">
                <span className="caption-medium network-name">{network.name}</span>
              
                <div className="d-none d-xl-flex">
                  {network?.chains?.map(chain => <ChainBadge chain={chain} />)}
                </div>
                
              </div>
              <div className="d-flex align-items-center justify-content-between mt-2 text-nowrap">
                <div className="bg-dark-gray p-1 px-2 border-radius-8">
                  {formatNumberToNScale(network?.totalValueLock || 0, 0)}{" "}
                  <span className="text-uppercase text-gray-500">
                    TVL
                  </span>
                </div>

                <div className="bg-dark-gray p-1 border-radius-8 px-2">
                  {network?.totalIssues || 0}{" "}
                  <span className="text-uppercase text-gray-500">
                    {t("label", { count: network?.totalIssues || 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
      </div>
    </Link>
  );
}