import React, {ReactNode, useEffect, useState} from "react";

import {useTranslation} from "next-i18next";

import ChainIcon from "components/chain-icon";
import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import ReactSelect from "components/react-select";

import {useAppState} from "contexts/app-state";

import {SupportedChainData} from "interfaces/supported-chain-data";

import useBreakPoint from "x-hooks/use-breakpoint";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

interface SelectChainDropdownProps {
  onSelect: (chain: SupportedChainData) => void;
  defaultChain?: SupportedChainData;
  isOnNetwork?: boolean;
  className?: string;
  isDisabled?: boolean;
  placeHolder?: string;
  shouldMatchChain?: boolean;
  readonly?: boolean;
}

interface ChainOption {
  label: string;
  value: SupportedChainData | Partial<SupportedChainData>;
  preIcon: ReactNode;
  isDisabled?: boolean;
  tooltip?: string;
}

export default function SelectChainDropdown({
  defaultChain,
  isOnNetwork,
  className = "text-uppercase",
  onSelect,
  isDisabled,
  placeHolder,
  shouldMatchChain = true,
  readonly,
}: SelectChainDropdownProps) {
  const { t } = useTranslation("common");

  const [options, setOptions] = useState<ChainOption[]>([]);
  const [selected, setSelectedChain] = useState<ChainOption>(null);

  const { isDesktopView } = useBreakPoint();
  const { state: { Service, currentUser } } = useAppState();
  const { supportedChains, connectedChain } = useSupportedChain();
  const marketplace = useMarketplace();

  const placeholder = 
    !shouldMatchChain ? t("misc.all-chains") : placeHolder ? placeHolder : t("forms.select-placeholder");

  function chainToOption(chain: SupportedChainData | Partial<SupportedChainData>, isDisabled?: boolean): ChainOption {
    return {
      value: chain,
      label: chain.chainShortName,
      preIcon: (<ChainIcon src={chain.icon} />),
      isDisabled,
      tooltip: isDisabled
      ? t("errors.not-available-chain")
      : chain?.chainShortName?.length > 12
      ? chain.chainShortName
      : undefined,
    };
  }

  function isChainConfigured({ registryAddress }: SupportedChainData) {
    return currentUser?.isAdmin || !!registryAddress;
  }

  async function selectSupportedChain({value}) {
    if (readonly) return;

    const chain = supportedChains?.find(({ chainId }) => +chainId === +value.chainId);

    if (!chain || chain?.chainId === selected?.value?.chainId)
      return;

    onSelect(chain);
    setSelectedChain(chainToOption(chain));
  }

  function updateSelectedChainMatchConnected() {
    if (!shouldMatchChain) {
      setSelectedChain(null);
      return;
    }

    let chain = undefined;

    if (isOnNetwork && marketplace?.active?.chain)
      chain = 
        options?.find(({ value: { chainId } }) => chainId === +(marketplace?.active?.chain?.chainId))?.value;
    else
      chain =
        options?.find(({ value: { chainId } }) => chainId === +(defaultChain?.chainId || connectedChain?.id))?.value;

    if (!chain) {
      setSelectedChain(null);
      return;
    }

    sessionStorage.setItem("currentChainId", chain.chainId.toString());

    setSelectedChain(chainToOption(chain));
  }

  async function updateOptions() {
    if (!supportedChains || (isOnNetwork && !marketplace?.availableChains)) return;

    const configuredChains = supportedChains.filter(isChainConfigured);

    if (isOnNetwork)
      setOptions(configuredChains.map(chain =>
        chainToOption(chain, !marketplace?.availableChains?.find(({ chainId }) => chainId === chain.chainId))));
    else
      setOptions(configuredChains.map(chain => chainToOption(chain)));
  }

  function getNativeOptions() {
    return options.map((opt, index) => ({
      label: opt?.label,
      value: index,
    }));
  }

  function onNativeChange(selectedOption) {
    selectSupportedChain(options[selectedOption?.value]);
  }

  useEffect(() => {
    updateOptions();
  }, [
    isOnNetwork,
    marketplace?.availableChains,
    supportedChains,
    currentUser?.isAdmin
  ]);

  useEffect(updateSelectedChainMatchConnected, [
    options,
    marketplace?.active?.chain,
    connectedChain?.id,
    shouldMatchChain
  ]);

  return(
    <NativeSelectWrapper
      options={getNativeOptions()}
      onChange={onNativeChange}
    >
      <div className={className}>
        <ReactSelect
          menuPlacement={isDesktopView ? "auto" : "top"}
          options={options}
          value={selected}
          onChange={selectSupportedChain}
          placeholder={placeholder}
          isDisabled={isDisabled || !supportedChains?.length || !!defaultChain}
          isSearchable={false}
          readOnly={true}
          components={{
            Option: IconOption,
            SingleValue: IconSingleValue
          }}
        />
      </div>
    </NativeSelectWrapper>
  );
}