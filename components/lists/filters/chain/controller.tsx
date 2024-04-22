import { ReactNode, useEffect, useState } from "react";

import { useRouter } from "next/router";

import ChainIcon from "components/chain-icon";
import ChainFilterView from "components/lists/filters/chain/view";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { ChainFilterProps } from "types/components";
import { SelectOption } from "types/utils";

import useBreakPoint from "x-hooks/use-breakpoint";
import useQueryFilter from "x-hooks/use-query-filter";

export default function ChainFilter({
  chain,
  chains,
  direction = "horizontal",
  onChange,
  label = true,
  isClearable,
}: ChainFilterProps) {
  const { query } = useRouter();
  
  const findChain = chainShortName => chains?.find(c => c.chainShortName === chainShortName);

  const [selectedChain, setSelectedChain] = 
    useState<SupportedChainData>(chain || findChain(query?.networkChain?.toString()));

  const { isMobileView, isTabletView } = useBreakPoint();
  const { setValue } = useQueryFilter({ networkChain: query?.networkChain?.toString() });

  const chainToOption = (chain: SupportedChainData): SelectOption & { preIcon: ReactNode } => chain ? ({
    value: chain?.chainShortName,
    label: chain?.chainName,
    preIcon: <ChainIcon src={chain?.icon} />
  }) : null;

  function onChainChange(option: SelectOption) {
    if (onChange)
      onChange(option?.value);  
    else
      setValue({
        networkChain: option?.value,
      }, true);
    
    setSelectedChain(findChain(option?.value));
  }

  useEffect(() => {
    if (!onChange)
      setSelectedChain(findChain(query?.networkChain?.toString()));
  }, [query?.networkChain]);

  useEffect(() => {
    setSelectedChain(chain);
  }, [chain]);

  return(
    <ChainFilterView
      options={chains?.map(chainToOption)}
      option={chainToOption(selectedChain)}
      onChange={onChainChange}
      direction={direction}
      isMobile={isMobileView || isTabletView}
      label={label}
      isClearable={isClearable}
    />
  );
}