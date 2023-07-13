import { useEffect, useState } from "react";

import ChainFilterView from "components/lists/filters/chain/view";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { ChainFilterProps } from "types/components";
import { SelectOption } from "types/utils";

import useBreakPoint from "x-hooks/use-breakpoint";
import useQueryFilter from "x-hooks/use-query-filter";

export default function ChainFilter({
  chains,
  direction = "horizontal",
  onChange,
}: ChainFilterProps) {
  const [chain, setChain] = useState<SupportedChainData>();

  const { isMobileView, isTabletView } = useBreakPoint();
  const { setValue } = useQueryFilter({ networkChain: null });

  const chainToOption = (chain: SupportedChainData): SelectOption => chain ? ({
    value: chain?.chainShortName,
    label: chain?.chainName,
  }) : null;

  const findChain = chainShortName => chains?.find(c => c.chainShortName === chainShortName)

  function onChainChange(option: SelectOption) {
    if (onChange)
      onChange(option?.value);  
    else
      setValue({
        networkChain: option?.value,
      }, true);
    
    setChain(findChain(option?.value));
  }

  return(
    <ChainFilterView
      options={chains.map(chainToOption)}
      option={chainToOption(chain)}
      onChange={onChainChange}
      direction={direction}
      isMobile={isMobileView || isTabletView}
    />
  );
}