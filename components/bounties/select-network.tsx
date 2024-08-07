import {useEffect, useState} from "react";

import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import If from "components/If";
import NetworkLogo from "components/network-logo";
import ReactSelect from "components/react-select";

import {MINUTE_IN_MS} from "helpers/constants";
import {isOnNetworkPath} from "helpers/network";
import {QueryKeys} from "helpers/query-keys";

import {Network} from "interfaces/network";

import {useSearchNetworks} from "x-hooks/api/marketplace";
import useChain from "x-hooks/use-chain";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import {useSettings} from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

import {baseApiImgUrl} from "../../services/api";

interface SelectNetworkProps {
  isCurrentDefault?: boolean;
  onlyProfileFilters?: boolean;
  filterByConnectedChain?: boolean;
  hideLabel?: boolean;
  isClearable?: boolean;
  onChange?: (network: Network) => void;
  fontRegular?: boolean;
}

export default function SelectNetwork({
  isCurrentDefault = false,
  onlyProfileFilters = false,
  filterByConnectedChain = false,
  hideLabel,
  onChange,
  isClearable = true,
  fontRegular = false,
} : SelectNetworkProps) {
  const { t } = useTranslation("common");
  const { query, pathname, asPath, push } = useRouter();

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(undefined);

  const { chain } = useChain();
  const { settings } = useSettings();
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
          src={`${baseApiImgUrl}/${settings?.urls?.ipfs}/${network?.logoIcon}`}
          alt={`${network?.name} logo`}
          isBepro={network?.name.toLowerCase() === 'bepro'}
          size="sm"
          noBg
        />
      )
    };
  }

  function handleChange(newValue) {
    if (!newValue || newValue?.value?.networkAddress !== selected?.value?.networkAddress) {
      setSelected(newValue);
      if (onChange) {
        onChange(newValue?.value);
        return;
      }
      const newQuery = {
        ...query,
        page: "1",
        networkName: newValue?.value?.name
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
    if (!query?.network && !query?.networkName)
      setSelected(null);
  }, [networks, query]);

  useEffect(() => {
    if (marketplace?.active && !selected && isCurrentDefault)
      setSelected(networkToOption(marketplace?.active));
  }, [isCurrentDefault, marketplace?.active]);

  return(
    <div className={`${onlyProfileFilters ? 'mb-3' : 'd-flex align-items-center'}`}>
      <If condition={!hideLabel}>
        <span
        className={`${
          fontRegular ? "sm-regular text-white" : "sm-regular  text-gray-100"
        } font-weight-medium text-nowrap mr-1 text-capitalize`}
      >
          {t("misc.network")}
        </span>
      </If>
      <NativeSelectWrapper
        options={options}
        onChange={handleChange}
        selectedIndex={options?.findIndex((opt) =>
            opt?.value?.networkAddress === selected?.value?.networkAddress)}
        isClearable
      >
        <ReactSelect
          value={selected}
          options={options}
          onChange={handleChange}
          inputProps={{ 'data-testid': 'network-select' }}
          placeholder={t("select-a-network")}
          components={{
            Option: IconOption,
            SingleValue: IconSingleValue,
          }}
          isClearable={isClearable}
        />
      </NativeSelectWrapper>
    </div>
  );
}