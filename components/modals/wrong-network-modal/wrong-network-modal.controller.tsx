import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useSwitchChain } from "wagmi";

import WrongNetworkModalView from "components/modals/wrong-network-modal/wrong-network-modal.view";

import { UNSUPPORTED_CHAIN } from "helpers/constants";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function WrongNetworkModal() {
  const { pathname } = useRouter();
  const { switchChainAsync } = useSwitchChain();

  const [error, setError] = useState<string>("");
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);
  const [networkChain, setNetworkChain] = useState<SupportedChainData>(null);
  const [chosenSupportedChain, setChosenSupportedChain] = useState<SupportedChainData>(null);

  const marketplace = useMarketplace();
  const { supportedChains, connectedChain } = useSupportedChain();

  const { currentUser } = useUserStore();
  const { wrongNetworkModal: show, loading, updateWrongNetworkModal } = useLoadersStore();

  const isRequired = pathname?.includes("new-marketplace");
  const canBeHided = !isRequired;

  async function selectSupportedChain(chain: SupportedChainData) {
    if (!chain) return;
    setChosenSupportedChain(chain);
  }

  function onClose () {
    if (canBeHided) updateWrongNetworkModal(false);
  }

  async function _handleAddNetwork() {
    setIsAddingNetwork(true);
    setError("");
    switchChainAsync({ chainId: chosenSupportedChain?.chainId })
      .then(() => {
        onClose();
      })
      .catch(console.debug)
      .finally(() => {
        setIsAddingNetwork(false);
      });
  }

  function updateNetworkChain() {
    if (supportedChains?.length && marketplace?.active?.chain_id) {
      const chain = supportedChains.find(({ chainId }) => +marketplace?.active?.chain_id === +chainId );

      setNetworkChain(chain);
      setChosenSupportedChain(chain);
    }
    else
      setNetworkChain(null);
  }

  function changeShowNetworkModal() {
    if (!supportedChains?.length || loading?.isLoading) {
      updateWrongNetworkModal(false);
      return;
    }
    const connectedWithSupportedChain = !!supportedChains?.find(e => e.chainId === +connectedChain.id)
    updateWrongNetworkModal([
      !connectedWithSupportedChain && isRequired,
      connectedChain?.name === UNSUPPORTED_CHAIN && isRequired
    ].some(c => c));
  }

  const isButtonDisabled = () => [isAddingNetwork].some((values) => values);

  useEffect(updateNetworkChain, [marketplace?.active?.chain_id, supportedChains]);
  useEffect(changeShowNetworkModal, [
    currentUser?.walletAddress,
    connectedChain?.id,
    supportedChains,
    loading,
    isRequired
  ]);

  return (
    <WrongNetworkModalView
      walletAddress={currentUser?.walletAddress}
      error={error}
      networkChain={networkChain}
      show={show}
      isAddingNetwork={isAddingNetwork}
      isButtonDisabled={isButtonDisabled()}
      onCloseClick={onClose}
      onButtonClick={_handleAddNetwork}
      onSelectChain={selectSupportedChain}
    />
  );
}
