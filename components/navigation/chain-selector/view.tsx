import SelectChainDropdown from "components/select-chain-dropdown";

import { SupportedChainData } from "interfaces/supported-chain-data";

interface ChainSelectorViewProps {
  isOnNetwork: boolean;
  onSelect: (chain: SupportedChainData) => void | Promise<void>;
  isFilter?: boolean;
  shouldMatchChain?: boolean;
  placeholder?: string;
}

export default function ChainSelectorView({
  isOnNetwork,
  isFilter,
  shouldMatchChain,
  onSelect,
  placeholder,
}: ChainSelectorViewProps) {

  return(
    <SelectChainDropdown
      onSelect={onSelect}
      isOnNetwork={isOnNetwork}
      className={isFilter ? null : 'select-network-dropdown'}
      shouldMatchChain={shouldMatchChain}
      readonly={!shouldMatchChain}
      placeHolder={placeholder}
    />
  );
}