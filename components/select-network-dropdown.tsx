import React, {useEffect, useState, ReactNode} from "react";

import {useTranslation} from "next-i18next";

import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import Indicator from "components/indicator";
import ReactSelect from "components/react-select";

import {SupportedChainData} from "interfaces/supported-chain-data";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

interface SelectNetworkDropdownProps {
  onSelect: (chain: SupportedChainData) => void;
  defaultChain?: SupportedChainData;
  isOnNetwork?: boolean;
  className?: string;
  isDisabled?: boolean;
  placeHolder?: string;
}

interface ChainOption {
  label: string;
  value: SupportedChainData | Partial<SupportedChainData>;
  preIcon: ReactNode;
  isDisabled?: boolean;
  tooltip?: string;
}

export default function SelectNetworkDropdown({ 
  defaultChain,
  isOnNetwork,
  className = "text-uppercase",
  onSelect,
  isDisabled,
  placeHolder
}: SelectNetworkDropdownProps) {
  const { t } = useTranslation("common");

  const [options, setOptions] = useState<ChainOption[]>([]);
  const [selected, setSelectedChain] = useState<ChainOption>(null);

  const { currentUser } = useUserStore();
  const { supportedChains, connectedChain } = useSupportedChain();
  const marketplace = useMarketplace();

  function chainToOption(chain: SupportedChainData | Partial<SupportedChainData>, isDisabled?: boolean): ChainOption { 
    return { 
      value: chain, 
      label: chain.chainShortName,
      preIcon: (<Indicator bg={isDisabled ? "gray" : chain.color} />),
      isDisabled,
      tooltip: isDisabled
      ? "Not available on this chain"
      : chain?.chainShortName?.length > 12
      ? chain.chainShortName
      : undefined,
    };
  }

  function isChainConfigured({ registryAddress }: SupportedChainData) {
    return currentUser?.isAdmin || !!registryAddress;
  }

  async function selectSupportedChain({value}) {
    const chain = supportedChains?.find(({ chainId }) => +chainId === +value.chainId);

    if (!chain || chain?.chainId === selected?.value?.chainId)
      return;

    onSelect(chain);
    setSelectedChain(chainToOption(chain));
  }

  function updateSelectedChainMatchConnected() {
    let chain = undefined;
    
    if (isOnNetwork && marketplace?.active?.chain)
      chain = marketplace?.active?.chain;
    else
      chain = 
        options?.find(({ value: { chainId } }) => chainId === +(defaultChain?.chainId || connectedChain.id))?.value;

    if (!chain) {
      return;
    }

    sessionStorage.setItem("currentChainId", chain.chainId.toString());

    setSelectedChain(chainToOption(chain));
  }

  function updateOptions() {
    if (!supportedChains || (isOnNetwork && !marketplace?.availableChains)) return;

    const configuredChains = supportedChains.filter(isChainConfigured);

    if (isOnNetwork)
      setOptions(configuredChains.map(chain => 
        chainToOption(chain, !marketplace?.availableChains?.find(({ chainId }) => chainId === chain.chainId))));
    else
      setOptions(configuredChains.map(chain => chainToOption(chain)));
  }

  useEffect(updateOptions, [
    isOnNetwork,
    marketplace?.availableChains,
    supportedChains,
    currentUser?.isAdmin
  ]);

  useEffect(updateSelectedChainMatchConnected, [
    options,
    marketplace?.active?.chain,
    connectedChain?.id
  ]);

  return(
    <div className={className}>
      <ReactSelect 
        options={options}
        value={selected}
        onChange={selectSupportedChain}
        placeholder={placeHolder ? placeHolder : t("forms.select-placeholder")}
        isDisabled={isDisabled || !supportedChains?.length || !!defaultChain}
        readOnly={true}
        components={{
          Option: IconOption,
          SingleValue: IconSingleValue
        }}
      />
    </div>
  );
}