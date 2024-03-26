import { useTranslation } from "next-i18next";

import CreateBountyNetworkDropdown from "components/bounty/create-bounty/create-bounty-network-dropdown";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import ChainFilter from "components/lists/filters/chain/controller";

import { lowerCaseCompare } from "helpers/string";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";

import useSupportedChain from "x-hooks/use-supported-chain";

export interface SelectNetworkSectionProps {
  currentNetwork: Network;
  currentChain: SupportedChainData;
  networksOfCurrentChain: Network[];
  onChainChange: (chain: SupportedChainData) => void;
  onNetworkChange: (network: Network) => void;
}

export default function SelectNetworkSection({
  currentNetwork,
  currentChain,
  networksOfCurrentChain,
  onChainChange,
  onNetworkChange,
}: SelectNetworkSectionProps) {
  const { t } = useTranslation(["bounty", "common"]);

  const { supportedChains } = useSupportedChain();

  const notFoundNetworks = !networksOfCurrentChain?.length;

  function handleChainChange(selectedChainName) {
    onChainChange(supportedChains?.find(c => lowerCaseCompare(c?.chainShortName, selectedChainName)));
  }

  return(
    <div className="mt-2">
      <h5>
        {t("steps.select-network")}
      </h5>

      <p className="text-gray-200">
        {t("descriptions.select-network")}
      </p>

      <div className="col-md-6">
        <label className="p mb-2 text-gray-300">
          {t("common:placeholders.select-chain")}
        </label>

        <ChainFilter
          chain={currentChain}
          chains={supportedChains}
          label={false}
          isClearable={false}
          onChange={handleChainChange}
        />

        <label className="p mb-2 text-gray-300 mt-4">
          {t("bounty:steps.select-network")}
        </label>

        <CreateBountyNetworkDropdown
          value={currentNetwork}
          networks={networksOfCurrentChain}
          className="select-network-dropdown w-max-none"
          onSelect={onNetworkChange}
        />

        <If condition={notFoundNetworks}>
          <ContextualSpan context="danger" className="my-3">
            {t("bounty:errors.no-networks-chain")}
          </ContextualSpan>
        </If>
      </div>  
    </div>
  );
}