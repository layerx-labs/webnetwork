import {useTranslation} from "next-i18next";

import {ContextualSpan} from "components/contextual-span";
import {NewNetworkStepper} from "components/custom-network/new-network-stepper";
import If from "components/If";

import {Network} from "interfaces/network";

import useSupportedChain from "x-hooks/use-supported-chain";

interface NetworkSetupProps { 
  isVisible?: boolean;
  defaultNetwork?: Network;
}

export function NetworkSetup({
  isVisible,
  defaultNetwork
} : NetworkSetupProps) {
  const { t } = useTranslation("setup");

  const { connectedChain } = useSupportedChain();

  if (!isVisible)
    return <></>;

  return(
    <div className="content-wrapper border-top-0 px-2 py-2">
      <If condition={!!defaultNetwork && defaultNetwork.chain_id === connectedChain.id}
          children={
            <ContextualSpan context="primary" isAlert>
              <span>{t("network.errors.network-already-saved", {network: defaultNetwork?.name})}</span>
            </ContextualSpan>
          }
          otherwise={<NewNetworkStepper />}
      />
    </div>
  );
}