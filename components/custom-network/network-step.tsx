import { useTranslation } from "next-i18next";
import { useSwitchChain } from "wagmi";

import SelectChainDropdown from "components/select-chain-dropdown";
import Step from "components/step";

import { StepWrapperProps } from "interfaces/stepper";
import { SupportedChainData } from "interfaces/supported-chain-data";

export default function NetworkStep({
  activeStep,
  index,
  handleClick,
  validated,
}: StepWrapperProps) {
  const { t } = useTranslation("common");
  const { switchChainAsync } = useSwitchChain();
  
  async function handleNetworkSelected(chain: SupportedChainData) {
    if (!chain)
      return;
    return switchChainAsync({
      chainId: chain.chainId
    })
      .catch((err) => console.log("handle Add Network error", err));
  }

  return (
    <Step
      title={t("placeholders.select-chain")}
      index={index}
      activeStep={activeStep}
      validated={validated}
      handleClick={handleClick}
    >
      <SelectChainDropdown
        onSelect={handleNetworkSelected}
        isOnNetwork={false}
        className="select-network-dropdown w-max-none mb-4"
      />
    </Step>
  );
}
