import { useEffect, useState } from "react";

import ChainFilterView from "components/lists/filters/chain/view";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { SelectOption } from "types/utils";

import useQueryFilter from "x-hooks/use-query-filter";

interface ChainFilterProps {
  chains: SupportedChainData[];
}

export default function ChainFilter({
  chains
}: ChainFilterProps) {
  const [chain, setChain] = useState<SupportedChainData>();

  const { value, setValue } = useQueryFilter({ networkChain: null });

  const chainToOption = (chain: SupportedChainData): SelectOption => chain ? ({
    value: chain?.chainShortName,
    label: chain?.chainName,
  }) : null;

  function onChainChange(option: SelectOption) {
    setValue({
      networkChain: option?.value,
    }, true);
  }

  useEffect(() => {
    setChain(chains?.find(c => c.chainShortName === value.networkChain));
  }, [value]);

  return(
    <ChainFilterView
      options={chains.map(chainToOption)}
      option={chainToOption(chain)}
      onChange={onChainChange}
    />
  );
}