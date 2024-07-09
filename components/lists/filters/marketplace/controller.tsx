import {ReactNode, useState} from "react";

import getConfig from "next/config";
import {useRouter} from "next/router";

import MarketplaceFilterView from "components/lists/filters/marketplace/view";
import NetworkLogo from "components/network-logo";

import {Network} from "interfaces/network";

import {MarketplaceFilterProps} from "types/components";
import {SelectOption} from "types/utils";

import useBreakPoint from "x-hooks/use-breakpoint";
import useQueryFilter from "x-hooks/use-query-filter";

import {baseApiImgUrl} from "../../../../services/api";

const { publicRuntimeConfig } = getConfig();
export default function MarketplaceFilter({
  marketplaces,
  direction = "horizontal",
  onChange,
  label = true
}: MarketplaceFilterProps) {
  const { query } = useRouter();
  
  const findMarketplace = name => marketplaces?.find(m => m.name === name);

  const [marketplace, setMarketplace] = useState<Network>(findMarketplace(query?.networkName?.toString()));

  const { isMobileView, isTabletView } = useBreakPoint();
  const { setValue } = useQueryFilter({ networkName: query?.networkName?.toString() });

  const marketplaceToOption = (marketplace: Network): SelectOption & { preIcon: ReactNode } => marketplace ? ({
    value: marketplace?.name,
    label: marketplace?.name,
    preIcon: <NetworkLogo
              src={`${baseApiImgUrl}/${publicRuntimeConfig?.urls?.ipfs}/${marketplace?.logoIcon}`}
              alt={`${marketplace?.name} logo`}
              size="sm"
              noBg
            />
  }) : null;

  function onChainChange(option: SelectOption) {
    if (onChange)
      onChange(option?.value);  
    else
      setValue({
        networkChain: option?.value,
      }, true);

    setMarketplace(findMarketplace(option?.value));
  }

  return(
    <MarketplaceFilterView
      options={marketplaces?.map(marketplaceToOption)}
      option={marketplaceToOption(marketplace)}
      onChange={onChainChange}
      direction={direction}
      isMobile={isMobileView || isTabletView}
      label={label}
    />
  );
}