import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import NetworkLogo from "components/network-logo";
import ReactSelect from "components/react-select";

import { useAppState } from "contexts/app-state";

import { MINUTE_IN_MS } from "helpers/constants";
import { isOnNetworkPath } from "helpers/network";
import { QueryKeys } from "helpers/query-keys";

import { Network } from "interfaces/network";

import { useSearchNetworks } from "x-hooks/api/marketplace";
import useChain from "x-hooks/use-chain";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import useSupportedChain from "x-hooks/use-supported-chain";

interface SelectNetworkProps {
  isCurrentDefault?: boolean;
  onlyProfileFilters?: boolean;
  filterByConnectedChain?: boolean;
  fontRegular?: boolean;
}

export default function SelectNetwork({
  isCurrentDefault = false,
  onlyProfileFilters = false,
  filterByConnectedChain = false,
  fontRegular = false
} : SelectNetworkProps) {
  const { t } = useTranslation("common");
  const { query, pathname, asPath, push } = useRouter();

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(undefined);

  const { chain } = useChain();
  const { state } = useAppState();
  const { connectedChain } = useSupportedChain();
  const marketplace = useMarketplace();

  const chainIdToFilter = filterByConnectedChain ? (!isOnNetworkPath(pathname) ? 
      connectedChain?.id : chain?.chainId?.toString()) : undefined;

  const { data: networks } = useReactQuery( QueryKeys.networksByChain(chainIdToFilter), 
                                            () => useSearchNetworks({ chainId: chainIdToFilter }),
                                            {
                                              staleTime: MINUTE_IN_MS
                                            });

  function networkToOption(network: Network) {
    return {
      label: network.name,
      value: network,
      preIcon: (
        <NetworkLogo
          src={`${state.Settings?.urls?.ipfs}/${network?.logoIcon}`}
          alt={`${network?.name} logo`}
          isBepro={network?.name.toLowerCase() === 'bepro'}
          size="sm"
          noBg
        />
      )
    };
  }

  function onChange(newValue) {
    if (!newValue || newValue?.value?.networkAddress !== selected?.value?.networkAddress) {
      setSelected(newValue);

      const newQuery = {
        ...query,
        page: "1",
        networkName: newValue?.value?.name || "all"
      };

      push({ pathname: pathname, query: newQuery }, asPath);
    }
  }

  function handleSelectedWithNetworkName(options, name) {
    const opt = options?.find(({ value }) => value?.name === name)
    setSelected(opt);
  }

  useEffect(() => {
    const options = networks?.rows?.map(networkToOption);
    setOptions(options || [])
    if(query?.networkName)
      handleSelectedWithNetworkName(options, query?.networkName);
    if(query?.network && !query?.networkName)
      handleSelectedWithNetworkName(options, query?.network);
  }, [networks, query]);

  useEffect(() => {
    if (marketplace?.active && !selected && isCurrentDefault)
      setSelected(networkToOption(marketplace?.active));
  }, [isCurrentDefault, marketplace?.active]);

  return(
    <div className={`${onlyProfileFilters ? 'mb-3' : 'd-flex align-items-center'}`}>
      <span
        className={`${
          fontRegular ? "sm-regular text-white" : "caption-small  text-gray-100"
        } font-weight-medium text-nowrap mr-1`}
      >
        {t("misc.network")}
      </span>
      <NativeSelectWrapper
        options={options}
        onChange={onChange}
        selectedIndex={options?.findIndex((opt) =>
            opt?.value?.networkAddress === selected?.value?.networkAddress)}
        isClearable
      >
        <ReactSelect
          value={selected}
          options={options}
          onChange={onChange}
          placeholder={t("select-a-network")}
          components={{
            Option: IconOption,
            SingleValue: IconSingleValue,
          }}
          isClearable
        />
      </NativeSelectWrapper>
    </div>
  );
}